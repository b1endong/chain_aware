// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IERC5192 {
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);

    function locked(uint256 tokenId) external view returns (bool);
}

/// Chứng chỉ hoàn thành khóa học: không chuyển nhượng, không burn, không approve.
/// Chỉ CompletionTracker (minter) được mint, mỗi người tối đa 1 chứng chỉ
contract SoulboundCertificate is ERC721, IERC5192 {
    error Soulbound();
    error NotMinter();
    error AlreadyCertified();
    error ZeroAddress();

    address public immutable i_minter;
    uint256 public totalSupply;
    mapping (address learner => uint256 tokenId) public certificateOf; // Mapping để lưu trữ tokenId của mỗi người học
    mapping (uint256 tokenId => uint256) public issuedAt; // Mapping để lưu trữ thời gian phát hành của mỗi token

    constructor(address minter) ERC721("SoulboundCertificate", "ACA"){
        if (minter == address(0)) revert ZeroAddress();
        i_minter = minter;
    }

    function mint(address to) external returns (uint256 tokenId) {
        if (msg.sender != i_minter) revert NotMinter();
        if (certificateOf[to] != 0) revert AlreadyCertified();
        tokenId = ++totalSupply;
        certificateOf[to] = tokenId;
        issuedAt[tokenId] = block.timestamp;
        _mint(to, tokenId);

        emit Locked(tokenId);
        
    }

    function locked(uint256 tokenId) external view returns (bool) {
        _requireOwned(tokenId);
        return true;
    }

    // Dưới đây là các hàm override để ngăn chặn việc chuyển nhượng, đốt, và cấp phép token
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        if (_ownerOf(tokenId) != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert Soulbound();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert Soulbound();
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
    }
}