// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TestToken} from "../../src/TestToken.sol";
import {ApprovalSink} from "../../src/ApprovalSink.sol";
import {Drainer} from "./Drainer.sol";

/// Minh họa cho bài học: điều gì xảy ra sau một approve không giới hạn.
contract PhishingLessonTest is Test {
    TestToken token;
    address victim = makeAddr("victim");
    address attacker = makeAddr("attacker");

    function setUp() public {
        token = new TestToken();
        vm.prank(victim);
        token.faucet();
    }

    /// Spender độc hại (chỉ có trong test) rút sạch token sau approve không giới hạn.
    function test_drainer_stealsEverything_afterUnlimitedApprove() public {
        Drainer drainer = new Drainer();
        vm.prank(victim);
        token.approve(address(drainer), type(uint256).max);

        vm.prank(attacker); // không cần thêm chữ ký nào của nạn nhân
        drainer.drain(token, victim);

        assertEq(token.balanceOf(victim), 0);
        assertEq(token.balanceOf(attacker), 1_000 ether);
    }

    /// Thu hồi approval trước khi kẻ tấn công ra tay thì an toàn.
    function test_revokeBeforeDrain_protectsFunds() public {
        Drainer drainer = new Drainer();
        vm.startPrank(victim);
        token.approve(address(drainer), type(uint256).max);
        token.approve(address(drainer), 0);
        vm.stopPrank();

        vm.prank(attacker);
        vm.expectRevert();
        drainer.drain(token, victim);
        assertEq(token.balanceOf(victim), 1_000 ether);
    }

    /// ApprovalSink (contract triển khai thật cho bài học) không thể di chuyển tài sản.
    function testFuzz_sinkCannotMoveFunds(bytes calldata data) public {
        ApprovalSink sink = new ApprovalSink();
        vm.prank(victim);
        token.approve(address(sink), type(uint256).max);

        (bool success,) = address(sink).call(data);
        emit log_named_uint("call succeeded", success ? 1 : 0);
        assertEq(token.balanceOf(victim), 1_000 ether);
    }
}