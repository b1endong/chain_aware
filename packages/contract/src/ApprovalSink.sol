// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// "Kẻ tấn công" giả cho bài học trên app: chỉ nhận approval để minh họa.
/// Cố ý KHÔNG có hàm gọi transferFrom, call/delegatecall tùy ý, receive/fallback, owner hay proxy.
contract ApprovalSink {
    string public constant PURPOSE = "ChainAware lesson sink: this contract cannot move your assets";
}