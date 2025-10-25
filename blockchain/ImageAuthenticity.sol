// Contrato Solidity para verificação de autenticidade
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageAuthenticity {
    struct ImageRecord {
        bytes32 imageHash;
        address uploader;
        uint256 timestamp;
        bool isVerified;
        string metadata;
    }
    
    mapping(bytes32 => ImageRecord) public images;
    mapping(address => uint256) public userUploads;
    
    event ImageRegistered(bytes32 indexed hash, address indexed uploader, uint256 timestamp);
    event ImageVerified(bytes32 indexed hash, bool isAuthentic);
    
    function registerImage(bytes32 _hash, string memory _metadata) public {
        require(images[_hash].uploader == address(0), "Image already registered");
        
        images[_hash] = ImageRecord({
            imageHash: _hash,
            uploader: msg.sender,
            timestamp: block.timestamp,
            isVerified: false,
            metadata: _metadata
        });
        
        userUploads[msg.sender]++;
        emit ImageRegistered(_hash, msg.sender, block.timestamp);
    }
    
    function verifyImage(bytes32 _hash, bool _isAuthentic) public {
        require(images[_hash].uploader != address(0), "Image not found");
        images[_hash].isVerified = _isAuthentic;
        emit ImageVerified(_hash, _isAuthentic);
    }
    
    function checkImage(bytes32 _hash) public view returns (ImageRecord memory) {
        return images[_hash];
    }
}
