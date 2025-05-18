// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingAdvanced {
    enum Phase {
        Init,
        CandidateRegistration,
        Voting,
        Ended
    }
    Phase public currentPhase;

    address public admin;

    struct Candidate {
        string name;
        uint voteCount;
        string manifesto;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    Candidate[] public candidates;
    mapping(address => Voter) public voters;

    event PhaseAdvanced(Phase newPhase);
    event CandidateAdded(string name);
    event VoterRegistered(address voter);
    event VoteCasted(address voter, uint candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyDuring(Phase phase) {
        require(currentPhase == phase, "Invalid phase");
        _;
    }

    modifier onlyRegistered() {
        require(voters[msg.sender].isRegistered, "Not a registered voter");
        _;
    }

    constructor() {
        admin = msg.sender;
        currentPhase = Phase.CandidateRegistration;
    }

    function advancePhase() public onlyAdmin {
        require(currentPhase != Phase.Ended, "Election has ended");
        currentPhase = Phase(uint(currentPhase) + 1);
        emit PhaseAdvanced(currentPhase);
    }

    function addCandidate(
        string memory _name,
        string memory _manifesto
    ) public onlyAdmin onlyDuring(Phase.CandidateRegistration) {
        candidates.push(Candidate(_name, 0, _manifesto));
        emit CandidateAdded(_name);
    }

    function registerVoter(
        address _voter
    ) public onlyAdmin onlyDuring(Phase.CandidateRegistration) {
        voters[_voter] = Voter(true, false);
        emit VoterRegistered(_voter);
    }

    function vote(
        uint _candidateId
    ) public onlyRegistered onlyDuring(Phase.Voting) {
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Already voted");
        require(_candidateId < candidates.length, "Invalid candidate");

        candidates[_candidateId].voteCount += 1;
        sender.hasVoted = true;
        emit VoteCasted(msg.sender, _candidateId);
    }

    function getCandidate(
        uint _index
    ) public view returns (string memory, uint, string memory) {
        Candidate storage c = candidates[_index];
        return (c.name, c.voteCount, c.manifesto);
    }

    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }
}
