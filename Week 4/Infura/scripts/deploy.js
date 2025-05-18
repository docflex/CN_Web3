const { ethers } = require("hardhat");

async function main() {
    const fee = ethers.parseEther("0.0001");

    const Contract = await ethers.getContractFactory("SubscriptionManager");
    const contract = await Contract.deploy(fee);
    await contract.waitForDeployment();

    console.log(`Contract Deployed To: ${contract.target}`);
}

main().catch(console.error);
