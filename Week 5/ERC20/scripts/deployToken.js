const hre = require("hardhat");

async function main() {
    const name = "DemoToken";
    const symbol = "DMT";
    const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1 million tokens

    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.deploy(name, symbol, initialSupply);

    await token.waitForDeployment();
    console.log("Token Deployed To:", token.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
