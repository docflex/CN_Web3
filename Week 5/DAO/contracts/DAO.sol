// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAO {
    event VoteCast(address indexed voter, uint256 proposalId, uint256 weight);

    function vote(uint256 proposalId, uint256 weight) public {
        emit VoteCast(msg.sender, proposalId, weight);
    }
}
