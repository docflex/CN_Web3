// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizedVoting {
    // ✅ 4. Packed Struct: small types first
    struct Candidate {
        uint8 age;
        bool isActive;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;

    address public owner;

    constructor() {
        owner = msg.sender;

        // ✅ Initializing candidates with optimized packing
        candidates[1] = Candidate({age: 45, isActive: true, voteCount: 0});
        candidates[2] = Candidate({age: 52, isActive: true, voteCount: 0});
    }

    // ✅ 1. Use uint256 by default (no uint8/uint32 for public vars unless packed)
    uint256 public totalVotes;

    // ✅ 2. Minimize Storage Writes: only write once
    function vote(uint256 _id) public {
        Candidate storage candidate = candidates[_id]; // 1 storage read
        require(candidate.isActive, "Candidate not active");

        uint256 tempCount = candidate.voteCount; // work in memory
        tempCount += 1;
        candidate.voteCount = tempCount; // 1 storage write

        totalVotes += 1; // unavoidable storage write, done once
    }

    // ✅ 3. Use calldata for external view function
    function getAges(
        uint256[] calldata _ids
    ) external view returns (uint8[] memory) {
        uint256 len = _ids.length;
        uint8[] memory ages = new uint8[](len);
        for (uint256 i = 0; i < len; i++) {
            ages[i] = candidates[_ids[i]].age;
        }
        return ages;
    }
}
