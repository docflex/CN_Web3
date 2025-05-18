const { expect } = require("chai");

describe("Advanced Voting", function () {
    let voting;
    let admin, voter1, voter2;

    beforeEach(async () => {
        [admin, voter1, voter2, ...others] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("VotingAdvanced", admin);
        voting = await Voting.deploy();
        await voting.waitForDeployment();
    });

    it("Full voting cycle", async () => {
        // Register candidates
        await voting.addCandidate("Alice", "Transparency & Jobs");
        await voting.addCandidate("Bob", "Security & Education");

        // Register voters
        await voting.registerVoter(voter1.address);
        await voting.registerVoter(voter2.address);

        // Move to voting phase
        await voting.advancePhase();

        // Voters vote
        await voting.connect(voter1).vote(0); // Alice
        await voting.connect(voter2).vote(1); // Bob

        // End election
        await voting.advancePhase();

        // Assert vote counts
        const [name1, votes1] = await voting.getCandidate(0);
        const [name2, votes2] = await voting.getCandidate(1);

        expect(votes1).to.equal(1);
        expect(votes2).to.equal(1);
    });

    it("Should prevent double voting", async () => {
        await voting.addCandidate("Alice", "Hope");
        await voting.registerVoter(voter1.address);
        await voting.advancePhase();

        await voting.connect(voter1).vote(0);
        await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Already voted");
    });

    it("Only admin can add candidates", async () => {
        await expect(
            voting.connect(voter1).addCandidate("Mallory", "Malicious")
        ).to.be.revertedWith("Not admin");
    });
});
