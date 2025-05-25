const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const nft = await MyNFT.deploy();

    await nft.waitForDeployment();

    console.log("NFT Deployed To: ", nft.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
