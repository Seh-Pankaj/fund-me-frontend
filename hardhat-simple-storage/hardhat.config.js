require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/block-number");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

const SEPOLIA_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "INR",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: "0x764ecF11eDb593f760a308C0cE78dc323b98003E",
    },
  },
};
