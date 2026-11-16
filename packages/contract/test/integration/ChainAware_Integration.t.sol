// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CompleteTracker} from "../../src/CompleteTracker.sol";
import {SoulboundCertificate} from "../../src/SoulboundCertificate.sol";

contract ChainAwareTest is Test {
    CompleteTracker tracker;
    SoulboundCertificate cert;

    uint256 attesterPk = 0xA11CE;
    uint256 attackerPk = 0xBAD;
    address alice = makeAddr("alice");
    address mallory = vm.addr(0xBAD);

    function setUp() public {
        tracker = new CompleteTracker(vm.addr(attesterPk));
        cert = tracker.i_certificate();
    }

    // ---------- helpers ----------
    function _completion(address learner, uint256 moduleId, uint256 nonce)
        internal
        view
        returns (CompleteTracker.Completion memory)
    {
        return CompleteTracker.Completion({
            learner: learner, moduleId: moduleId, score: 90, nonce: nonce, deadline: block.timestamp + 15 minutes
        });
    }

    function _sign(CompleteTracker.Completion memory c, uint256 pk) internal view returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, tracker.completeDigest(c));
        return abi.encodePacked(r, s, v);
    }

    function _completeAll(address learner) internal returns (uint256 tokenId) {
        for (uint256 m; m < 3; m++) {
            CompleteTracker.Completion memory c = _completion(learner, m, uint256(keccak256(abi.encode(learner, m))));
            tokenId = tracker.submit(c, _sign(c, attesterPk));
        }
    }

    // ---------- luồng đúng ----------
    function test_completeAllModules_mintsLockedCertificate() public {
        uint256 tokenId = _completeAll(alice);
        assertEq(tokenId, 1);
        assertEq(cert.ownerOf(1), alice);
        assertTrue(cert.locked(1));
        assertEq(cert.certificateOf(alice), 1);
        assertEq(tracker.completeMask(alice), 7); // 3 bit = 3 module
    }

    function test_supportsERC5192Interface() public view {
        assertTrue(cert.supportsInterface(0xb45a3c0e)); // ERC-5192
        assertTrue(cert.supportsInterface(0x80ac58cd)); // ERC-721
    }

    // ---------- kẻ tấn công: chứng chỉ ----------
    function test_transferCertificate_reverts() public {
        _completeAll(alice);
        vm.startPrank(alice);
        vm.expectRevert(SoulboundCertificate.Soulbound.selector);
        cert.transferFrom(alice, mallory, 1);
        vm.expectRevert(SoulboundCertificate.Soulbound.selector);
        cert.safeTransferFrom(alice, mallory, 1);
        vm.stopPrank();
    }

    function test_approveCertificate_reverts() public {
        _completeAll(alice);
        vm.startPrank(alice);
        vm.expectRevert(SoulboundCertificate.Soulbound.selector);
        cert.approve(mallory, 1);
        vm.expectRevert(SoulboundCertificate.Soulbound.selector);
        cert.setApprovalForAll(mallory, true);
        vm.stopPrank();
    }

    function test_directMint_byAttacker_reverts() public {
        vm.prank(mallory);
        vm.expectRevert(SoulboundCertificate.NotMinter.selector);
        cert.mint(mallory);
    }

    // ---------- kẻ tấn công: attestation ----------
    function test_forgedSignature_reverts() public {
        CompleteTracker.Completion memory c = _completion(mallory, 0, 1);
        bytes memory sig = _sign(c, attackerPk); // ký bằng khóa không phải attester
        vm.expectRevert(CompleteTracker.BadSignature.selector);
        tracker.submit(c, sig);
    }

    function test_tamperedScore_reverts() public {
        CompleteTracker.Completion memory c = _completion(alice, 0, 1);
        c.score = 80;
        bytes memory sig = _sign(c, attesterPk);
        c.score = 100; // sửa sau khi ký
        vm.expectRevert(CompleteTracker.BadSignature.selector);
        tracker.submit(c, sig);
    }

    function test_swappedLearner_reverts() public {
        CompleteTracker.Completion memory c = _completion(alice, 0, 1);
        bytes memory sig = _sign(c, attesterPk);
        c.learner = mallory; // đổi người nhận
        vm.expectRevert(CompleteTracker.BadSignature.selector);
        tracker.submit(c, sig);
    }

    function test_expiredAttestation_reverts() public {
        CompleteTracker.Completion memory c = _completion(alice, 0, 1);
        bytes memory sig = _sign(c, attesterPk);
        vm.warp(c.deadline + 1);
        vm.expectRevert(CompleteTracker.Expired.selector);
        tracker.submit(c, sig);
    }

    function test_replayAttestation_reverts() public {
        CompleteTracker.Completion memory c = _completion(alice, 0, 1);
        bytes memory sig = _sign(c, attesterPk);
        tracker.submit(c, sig);
        vm.expectRevert(CompleteTracker.NonceAlreadyUsed.selector);
        tracker.submit(c, sig);
    }

    function test_lowScore_reverts() public {
        CompleteTracker.Completion memory c = _completion(alice, 0, 1);
        c.score = 49;
        bytes memory sig = _sign(c, attesterPk);
        vm.expectRevert(CompleteTracker.ScoreTooLow.selector);
        tracker.submit(c, sig);
    }

    function test_unknownModule_reverts() public {
        CompleteTracker.Completion memory c = _completion(alice, 3, 1);
        bytes memory sig = _sign(c, attesterPk);
        vm.expectRevert(CompleteTracker.UnknownModule.selector);
        tracker.submit(c, sig);
    }

    function test_setAttester_onlyOwner() public {
        vm.prank(mallory);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, mallory));
        tracker.setAttester(mallory);
    }

    function test_secondCertificate_notMinted() public {
        _completeAll(alice);
        CompleteTracker.Completion memory c = _completion(alice, 0, 999);
        uint256 tokenId = tracker.submit(c, _sign(c, attesterPk));
        assertEq(tokenId, 0);
        assertEq(cert.totalSupply(), 1);
    }

    /// Fuzz: chữ ký ngẫu nhiên không bao giờ qua được.
    function testFuzz_randomSignature_neverAccepted(bytes calldata sig) public {
        CompleteTracker.Completion memory c = _completion(mallory, 0, 7);
        vm.expectRevert(CompleteTracker.BadSignature.selector);
        tracker.submit(c, sig);
    }
}