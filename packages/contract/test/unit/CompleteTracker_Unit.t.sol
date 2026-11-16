// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {CompleteTracker} from "../../src/CompleteTracker.sol";

contract CompleteTrackerUnitTest is Test {
    uint256 private constant ATTESTER_PRIVATE_KEY = 1;
    address public attester;
    address public owner;
    address public learner;
    struct Complete {
        address learner;
        uint256 moduleId;
        uint256 score;
        uint256 nonce;
        uint256 deadline;
    }
    CompleteTracker public tracker;


    function setUp() public {
        attester = vm.addr(ATTESTER_PRIVATE_KEY);
        owner = makeAddr("owner");
        learner = makeAddr("learner");
        vm.prank(owner);
        tracker = new CompleteTracker(attester);
        console.log("i_minter address:", address(tracker.i_certificate().i_minter()) , " tracker address: " ,address(tracker));
    }

    function completeModule(uint256 moduleId, uint256 score, uint256 nonce, uint256 deadline) internal{
        CompleteTracker.Completion memory completion = CompleteTracker.Completion({
            learner: learner,
            moduleId: moduleId,
            score: score,
            nonce: nonce,
            deadline: deadline
        });

        bytes32 digest = tracker.completeDigest(completion);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ATTESTER_PRIVATE_KEY, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(learner);
        tracker.submit(completion, signature);
    }

    function testConstructor() public view {
        assertEq(tracker.attester(), attester);
        assertEq(address(tracker.i_certificate()), address(tracker.i_certificate()));
        assertEq(address(tracker.owner()), owner);
    }

    function testSetAttester() public {
        address newAttester = makeAddr("newAttester");
        vm.prank(tracker.owner());
        tracker.setAttester(newAttester);
        assertEq(tracker.attester(), newAttester);
    }

    function testSubmit() public {
        uint256 moduleId = 1;
        uint256 score = 80;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;

        CompleteTracker.Completion memory completion = CompleteTracker.Completion({
            learner: learner,
            moduleId: moduleId,
            score: score,
            nonce: nonce,
            deadline: deadline
        });

        bytes32 digest = tracker.completeDigest(completion);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ATTESTER_PRIVATE_KEY, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(learner);
        tracker.submit(completion, signature);

        assertEq(tracker.completeMask(learner), 1 << moduleId);
        console.log("Complete mask for learner:", tracker.completeMask(learner));
    }

    function testSubmitWithInvalidSignature() public {
        uint256 moduleId = 1;
        uint256 score = 80;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;

        CompleteTracker.Completion memory completion = CompleteTracker.Completion({
            learner: learner,
            moduleId: moduleId,
            score: score,
            nonce: nonce,
            deadline: deadline
        });

        bytes32 digest = tracker.completeDigest(completion);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ATTESTER_PRIVATE_KEY + 1, digest); // Invalid private key
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(learner);
        vm.expectRevert(CompleteTracker.BadSignature.selector);
        tracker.submit(completion, signature);
    }

    function testSubmitandMintCertificate() public {
        uint256 moduleId = 1;
        uint256 score = 80;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;

        CompleteTracker.Completion memory completion = CompleteTracker.Completion({
            learner: learner,
            moduleId: moduleId,
            score: score,
            nonce: nonce,
            deadline: deadline
        });

        bytes32 digest = tracker.completeDigest(completion);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ATTESTER_PRIVATE_KEY, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(learner);
        tracker.submit(completion, signature);

        // Mint certificate for the learner
        vm.startPrank(address(tracker));
        tracker.i_certificate().mint(learner);
        vm.stopPrank();

        assertEq(tracker.i_certificate().certificateOf(learner), 1);
    }

    function testSubmitAllModulesAndMintCertificate() public {
        completeModule(0, 80, 1, block.timestamp + 1 hours);
        completeModule(1, 90, 2, block.timestamp + 1 hours);
        completeModule(2, 70, 3, block.timestamp + 1 hours);

        // Mint certificate for the learner

        assertEq(tracker.i_certificate().certificateOf(learner), 1);
    }
}