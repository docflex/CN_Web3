const { expect } = require("chai");

describe("Voting - Bulk Voting Test", function () {
    let voting;
    let accounts;

    beforeEach(async () => {
        accounts = await ethers.getSigners();

        const Voting = await ethers.getContractFactory("Voting", accounts[0]);
        voting = await Voting.deploy();
        await voting.waitForDeployment();

        // Add 3 candidates (only owner can do this)
    });

    it("should allow multiple accounts to vote for candidates", async () => {
        await voting.addCandidate("Alice");
        await voting.addCandidate("Bob");
        await voting.addCandidate("Charlie");
        const totalVoters = 10;

        for (let i = 1; i <= totalVoters; i++) {
            const voter = accounts[i]; // skip owner at index 0
            const candidateId = (i % 3) + 1; // 0, 1, 2 — rotates among 3 candidates

            await voting.connect(voter).vote(candidateId);
        }

        // Count votes for each candidate
        const aliceVotes = await voting.candidates(1);
        const bobVotes = await voting.candidates(2);
        const charlieVotes = await voting.candidates(3);

        console.log(
            `Votes - Alice: ${aliceVotes.voteCount}, Bob: ${bobVotes.voteCount}, Charlie: ${charlieVotes.voteCount}`
        );

        expect(
            aliceVotes.voteCount + bobVotes.voteCount + charlieVotes.voteCount
        ).to.equal(totalVoters);
    });
});
