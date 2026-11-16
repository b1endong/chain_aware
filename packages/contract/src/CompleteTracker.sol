// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {Ownable, Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {SoulboundCertificate} from "./SoulboundCertificate.sol";

contract CompleteTracker is EIP712, Ownable2Step {
    struct Completion {
        address learner;
        uint256 moduleId;
        uint256 score;
        uint256 nonce;
        uint256 deadline;
    }

    SoulboundCertificate public immutable i_certificate;
    address public attester;
    uint256 public constant PASS_SCORE = 50;
    uint256 public constant MODULE_COUNT = 3; // số lượng module trong khóa học, sử dụng bitmasking để lưu trữ trạng thái hoàn thành của từng module, ví dụ: 001 (module 1), 010 (module 2), 100 (module 3)
    uint256 public constant MAX_MODULE = (1 << MODULE_COUNT) - 1; // max module sẽ là 0111 (binary) = 7 (decimal)
    bytes32 public constant TYPE_HASH = keccak256("Completion(address learner,uint256 moduleId,uint256 score,uint256 nonce,uint256 deadline)");
    mapping(uint256 => bool) public usedNonces;
    mapping(address learner => uint256) public completeMask ; // Mapping để lưu trữ trạng thái hoàn thành của từng module cho mỗi người học, sử dụng bitmasking

    error ZeroAddress();
    error Expired();
    error UnknownModule();
    error ScoreTooLow();
    error NonceAlreadyUsed();
    error BadSignature();

    event AttesterChanged(address indexed oldAttester, address indexed newAttester);
    event CompletionSubmitted(address indexed learner, uint256 indexed moduleId, uint256 score, uint256 nonce, uint256 deadline);

    constructor(address attester_) EIP712("ChainAware", "1") Ownable(msg.sender){
        if (attester_ == address(0)) revert ZeroAddress();
        attester = attester_;
        i_certificate = new SoulboundCertificate(address(this));
        emit AttesterChanged(address(0), attester_);
    }

    function setAttester(address newAttester) external onlyOwner {
        if (newAttester == address(0)) revert ZeroAddress();
        attester = newAttester;
        emit AttesterChanged(attester, newAttester);
    }

    function completeDigest(Completion calldata c) public view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(TYPE_HASH, c.learner, c.moduleId, c.score, c.nonce, c.deadline)));
    }

    function submit(Completion calldata c, bytes calldata signature) external returns (uint256 tokenId){
        if (block.timestamp > c.deadline) revert Expired();
        if (c.moduleId >= MODULE_COUNT) revert UnknownModule();
        if (c.score < PASS_SCORE) revert ScoreTooLow();
        if (usedNonces[c.nonce]) revert NonceAlreadyUsed();

        // Kiểm tra chữ ký của attester
        if (!SignatureChecker.isValidSignatureNow(attester, completeDigest(c), signature)) revert BadSignature();

        // Cập nhật trạng thái hoàn thành của người học
        usedNonces[c.nonce] = true;
        uint256 mask = completeMask[c.learner] | (1 << c.moduleId);
        completeMask[c.learner] = mask;
        emit CompletionSubmitted(c.learner, c.moduleId, c.score, c.nonce, c.deadline);

        // Nếu người học đã hoàn thành tất cả các module, mint chứng chỉ
        if (mask == MAX_MODULE && i_certificate.certificateOf(c.learner) == 0) {
            tokenId = i_certificate.mint(c.learner);
        }
        
    }
}