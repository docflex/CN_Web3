const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", () => {
    let voting, owner, voter1, voter2;

    beforeEach(async () => {
        [owner, voter1, voter2] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();

        await voting.waitForDeployment();
    });

    it("Owner Should Add Candidates", async () => {
        await voting.addCandidate("Alice");
        await voting.addCandidate("Bob");

        const candidate1 = await voting.candidates(1);
        const candidate2 = await voting.candidates(2);

        expect(candidate1.name).to.equal("Alice");
        expect(candidate2.name).to.equal("Bob");
    });

    it("Non-Owner Should not Be Able to Add Candidates", async () => {
        await expect(voting.connect(voter1).addCandidate("Charlie")).to.be.revertedWith(
            "Only Owner can Call this Function"
        );
    });

    it("Should Allow Voting and prevent Double Voting", async () => {
        await voting.addCandidate("Alice");
        await voting.addCandidate("Bob");

        await voting.connect(voter1).vote(1);
        const candidate = await voting.candidates(1);
        expect(candidate.voteCount).to.be.equal(1);

        await expect(voting.connect(voter1).vote(2)).to.be.revertedWith("Already Voted");
    });

    it("Should return the Correct Winner", async () => {
        // Owner Adds 3 Candidates
        await voting.addCandidate("Alice");
        await voting.addCandidate("Bob");
        await voting.addCandidate("Charlie");

        // create more Voters
        let accounts = await ethers.getSigners();
        const voter3 = accounts[3];
        const voter4 = accounts[4];
        const voter5 = accounts[5];

        // Everyone Casts their Votes
        await voting.connect(voter1).vote(1); // Voter 1 Votes for Alice
        await voting.connect(voter2).vote(1); // Voter 2 Votes for Alice
        await voting.connect(voter3).vote(3); // Voter 3 Votes for Charlie
        await voting.connect(voter4).vote(2); // Voter 4 Votes for Bob
        await voting.connect(voter5).vote(1); // Voter 5 Votes for Alice

        const [winnerName, winnerVoteCount] = await voting.getWinner();
        expect(winnerName).to.be.equal("Alice");
        expect(winnerVoteCount).to.be.equal(3);
    });

    it("Voting for an Incorrect Candidate Id", async () => {
        await voting.addCandidate("Alice");

        await expect(voting.connect(voter1).vote(99)).to.be.revertedWith(
            "Invalid Candidate Id"
        );

        await expect(voting.connect(voter1).vote(0)).to.be.revertedWith(
            "Invalid Candidate Id"
        );
    });
});
