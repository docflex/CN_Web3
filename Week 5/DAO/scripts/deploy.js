const hre = require("hardhat");

async function main() {
    const DAO = await hre.ethers.getContractFactory("DAO");
    const dao = await DAO.deploy();

    await dao.waitForDeployment();

    console.log("Deployed DAO at: ", dao.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
