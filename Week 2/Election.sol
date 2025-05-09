// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Election
 * @dev A smart contract that manages a simple election process.
 */
contract Election {
    // Owner of the contract (e.g., election administrator)
    address public owner;

    // Represents a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Enum representing election states
    enum Phase {
        Init,
        Registration,
        Voting,
        Ended
    }
    Phase public currentPhase;

    // Voter tracking
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isRegistered;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    // Events
    event CandidateRegistered(uint id, string name);
    event Voted(address indexed voter, uint candidateId);
    event PhaseChanged(Phase newPhase);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    modifier inPhase(Phase _phase) {
        require(
            currentPhase == _phase,
            "Function cannot be called at this time."
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        currentPhase = Phase.Init;
    }

    // Start the registration phase
    function startRegistration() public onlyOwner inPhase(Phase.Init) {
        currentPhase = Phase.Registration;
        emit PhaseChanged(currentPhase);
    }

    // Register a voter (admin-controlled for simplicity)
    function registerVoter(
        address voter
    ) public onlyOwner inPhase(Phase.Registration) {
        require(!isRegistered[voter], "Voter already registered.");
        isRegistered[voter] = true;
    }

    // Register a candidate
    function registerCandidate(
        string memory name
    ) public onlyOwner inPhase(Phase.Registration) {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
        emit CandidateRegistered(candidatesCount, name);
    }

    // Start the voting phase
    function startVoting() public onlyOwner inPhase(Phase.Registration) {
        require(candidatesCount > 0, "No candidates registered.");
        currentPhase = Phase.Voting;
        emit PhaseChanged(currentPhase);
    }

    // Cast a vote
    function vote(uint candidateId) public inPhase(Phase.Voting) {
        require(isRegistered[msg.sender], "You are not registered to vote.");
        require(!hasVoted[msg.sender], "You have already voted.");
        require(
            candidateId > 0 && candidateId <= candidatesCount,
            "Invalid candidate."
        );

        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidateId);
    }

    // End the election
    function endElection() public onlyOwner inPhase(Phase.Voting) {
        currentPhase = Phase.Ended;
        emit PhaseChanged(currentPhase);
    }

    // Get winner (after election ends)
    function getWinner()
        public
        view
        inPhase(Phase.Ended)
        returns (string memory winnerName, uint voteCount)
    {
        uint maxVotes = 0;
        uint winningCandidateId;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        return (
            candidates[winningCandidateId].name,
            candidates[winningCandidateId].voteCount
        );
    }
}
