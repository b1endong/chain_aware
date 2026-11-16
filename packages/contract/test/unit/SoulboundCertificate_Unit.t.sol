// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {SoulboundCertificate} from "../../src/SoulboundCertificate.sol";

contract SoulboundCertificateUnitTest is Test {
    address public learner1;
    address public learner2;
    SoulboundCertificate public certificate;
    
    function setUp() public {
        learner1 = makeAddr("learner1");
        learner2 = makeAddr("learner2");
        certificate = new SoulboundCertificate(learner1);
    }

    function testMint() public {
        vm.prank(learner1);
        certificate.mint(learner1);
        assertEq(certificate.certificateOf(learner1), 1);
        assertEq(certificate.totalSupply(), 1);
        assertEq(certificate.issuedAt(1), block.timestamp);
        assertEq(certificate.locked(1), true);
    }

    function testMintNotMinter() public {
        vm.prank(learner1);
        certificate.mint(learner1);
        vm.prank(learner2);
        vm.expectRevert(SoulboundCertificate.NotMinter.selector);
        certificate.mint(learner1);
    }

    function testMintAlreadyCertified() public {
        vm.prank(learner1);
        uint256 tokenId = certificate.mint(learner1);
        console.log("Token ID:", tokenId);
        console.log("Certificate of learner1:", certificate.certificateOf(learner1));
        vm.prank(learner1);
        vm.expectRevert(SoulboundCertificate.AlreadyCertified.selector);
        certificate.mint(learner1);
    }

    function testNotAprroval() public {
        vm.prank(learner1);
        uint256 tokenId = certificate.mint(learner1);
        vm.prank(learner1);
        vm.expectRevert(SoulboundCertificate.Soulbound.selector);
        certificate.approve(learner2, tokenId);
    }
}