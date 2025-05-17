const hre = require("hardhat");

async function main() {
    const [admin] = await hre.ethers.getSigners();
    const Voting = await hre.ethers.getContractFactory("VotingAdvanced", admin);
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    console.log("Voting contract deployed to:", voting.target);

    const candidates = [
        { name: "Alice", manifesto: "Jobs and Healthcare" },
        { name: "Bob", manifesto: "Education and Safety" },
        { name: "Charlie", manifesto: "Taxes" },
        { name: "Darwin", manifesto: "Roads" },
        { name: "Evan", manifesto: "Infrastructure" },
        { name: "Frank", manifesto: "Equal opportunity" },
    ];

    for (let c of candidates) {
        await voting.addCandidate(c.name, c.manifesto);
        console.log(`Added candidate: ${c.name}`);
    }

    const voters = (await hre.ethers.getSigners()).slice(1, 11); // Register a few voters
    for (let v of voters) {
        await voting.registerVoter(v.address);
        console.log(`Registered voter: ${v.address}`);
    }
}

main().catch(console.error);
