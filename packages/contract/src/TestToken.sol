// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    uint256 public constant FAUCET_AMOUNT = 1_000 ether;

    constructor() ERC20("ChainAware Lesson Token", "CALT") {}

    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
    }
}