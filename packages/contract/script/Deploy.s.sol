// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {CompleteTracker} from "../src/CompleteTracker.sol";
import {TestToken} from "../src/TestToken.sol";
import {ApprovalSink} from "../src/ApprovalSink.sol";

contract Deploy is Script {
    function run() external {
        // Anvil (31337) cho dev, Saigon (202601) cho bản demo
        require(block.chainid == 31337 || block.chainid == 202601, "Chi Anvil hoac Saigon");
        address attester = vm.envAddress("ATTESTER_ADDRESS");

        vm.startBroadcast();
        CompleteTracker tracker = new CompleteTracker(attester);
        TestToken token = new TestToken();
        ApprovalSink sink = new ApprovalSink();
        vm.stopBroadcast();

        console.log("CompleteTracker:   ", address(tracker));
        console.log("SoulboundCertificate:", address(tracker.i_certificate()));
        console.log("TestToken:         ", address(token));
        console.log("ApprovalSink:        ", address(sink));
    }
}