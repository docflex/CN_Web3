const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Advanced Voting Contract - Full Lifecycle & Edge Cases", function () {
    let Voting, voting;
    let admin, voter1, voter2, voter3, voter4;

    beforeEach(async () => {
        [admin, voter1, voter2, voter3, voter4] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("VotingAdvanced", admin);
        voting = await Voting.deploy();
        await voting.waitForDeployment();
    });

    describe("Phase Enforcement", () => {
        it("Should prevent voting before voting phase", async () => {
            await voting.addCandidate("Alice", "Jobs");
            await voting.registerVoter(voter1.address);
            await expect(voting.connect(voter1).vote(0)).to.be.revertedWith(
                "Invalid phase"
            );
        });

        it("Should only allow admin to advance phase", async () => {
            await expect(voting.connect(voter1).advancePhase()).to.be.revertedWith(
                "Not admin"
            );
        });

        it("Should prevent actions after end phase", async () => {
            await voting.advancePhase(); // To Voting
            await voting.advancePhase(); // To Ended
            await expect(voting.advancePhase()).to.be.revertedWith("Election has ended");
        });
    });

    describe("Candidate and Voter Management", () => {
        it("Should not allow non-admin to register candidate or voter", async () => {
            await expect(
                voting.connect(voter1).addCandidate("Bob", "Security")
            ).to.be.revertedWith("Not admin");
            await expect(
                voting.connect(voter2).registerVoter(voter3.address)
            ).to.be.revertedWith("Not admin");
        });

        it("Should store candidate data correctly", async () => {
            await voting.addCandidate("Charlie", "Education");
            const [name, voteCount, manifesto] = await voting.getCandidate(0);
            expect(name).to.equal("Charlie");
            expect(voteCount).to.equal(0);
            expect(manifesto).to.equal("Education");
        });
    });

    describe("Voting Integrity", () => {
        beforeEach(async () => {
            await voting.addCandidate("Alice", "Jobs");
            await voting.addCandidate("Bob", "Healthcare");
            await voting.registerVoter(voter1.address);
            await voting.registerVoter(voter2.address);
            await voting.registerVoter(voter3.address);
            await voting.advancePhase(); // Move to Voting
        });

        it("Should allow each voter to vote only once", async () => {
            await voting.connect(voter1).vote(0);
            await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
                "Already voted"
            );
        });

        it("Should reject invalid candidate index", async () => {
            await expect(voting.connect(voter2).vote(99)).to.be.revertedWith(
                "Invalid candidate"
            );
        });

        it("Should accurately count votes", async () => {
            await voting.connect(voter1).vote(0); // Alice
            await voting.connect(voter2).vote(1); // Bob
            await voting.connect(voter3).vote(1); // Bob

            const [_, votesAlice] = await voting.getCandidate(0);
            const [__, votesBob] = await voting.getCandidate(1);

            expect(votesAlice).to.equal(1);
            expect(votesBob).to.equal(2);
        });
    });

    describe("Lifecycle Test", () => {
        it("Should run a full cycle with 4 voters and determine winner", async () => {
            await voting.addCandidate("Alice", "Green energy");
            await voting.addCandidate("Bob", "Tech growth");
            await voting.addCandidate("Carol", "Healthcare reform");

            const voters = [voter1, voter2, voter3, voter4];
            for (const v of voters) {
                await voting.registerVoter(v.address);
            }

            await voting.advancePhase(); // Voting phase

            await voting.connect(voter1).vote(0); // Alice
            await voting.connect(voter2).vote(1); // Bob
            await voting.connect(voter3).vote(1); // Bob
            await voting.connect(voter4).vote(2); // Carol

            await voting.advancePhase(); // Ended

            const [_, votesAlice] = await voting.getCandidate(0);
            const [__, votesBob] = await voting.getCandidate(1);
            const [___, votesCarol] = await voting.getCandidate(2);

            expect(votesAlice).to.equal(1);
            expect(votesBob).to.equal(2);
            expect(votesCarol).to.equal(1);
        });
    });

    describe("Gas Usage Check (Optional)", () => {
        it("Should estimate gas for vote", async () => {
            await voting.addCandidate("Test", "Manifesto");
            await voting.registerVoter(voter1.address);
            await voting.advancePhase();
            const gas = await voting.connect(voter1).vote.estimateGas(0);
            console.log(`Estimated gas for vote: ${gas.toString()}`);
            expect(Number(gas)).to.be.lessThan(100000);
        });
    });
});
