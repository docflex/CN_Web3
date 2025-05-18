require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: process.env.INFURA_SEPOLIA_RPC_ENDPOINT,
            accounts: [process.env.METAMASK_PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    sourcify: {
        enabled: true,
    },
};
