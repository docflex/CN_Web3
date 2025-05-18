const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying Contract with Account: ", deployer.address);

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    console.log("Voting Contract Deployed to: ", voting.target);

    // Add Initial Candidates
    const candidateNames = ["Alice", "Bob", "Charlie", "Darwin"];

    for (let name of candidateNames) {
        const tx = await voting.addCandidate(name);
        await tx.wait();
        console.log(`Candidate Added: ${name}`);
    }

    const total = await voting.candidateCount();
    console.log(`Total Candidates Registered: ${total}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
