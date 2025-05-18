// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract Voting {
    address public owner;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidateCount;
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can Call this Function");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidateCount += 1;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        emit CandidateAdded(candidateCount, _name);
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "Already Voted");
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid Candidate Id"
        );

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount += 1;
        emit Voted(msg.sender, _candidateId);
    }

    function getWinner()
        public
        view
        returns (string memory winnerName, uint voteCount)
    {
        uint winningVoteCount = 0;
        uint winningCandidateId = 0;

        for (uint i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        winnerName = candidates[winningCandidateId].name;
        voteCount = candidates[winningCandidateId].voteCount;
    }
}
