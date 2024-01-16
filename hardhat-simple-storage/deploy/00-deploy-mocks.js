const { network } = require("hardhat");
const {
  locDevChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  //   const chainId = network.config.chainId;

  if (locDevChains.includes(network.name)) {
    log("Local network detected! Deploying mocks!!", network.name);
    await deploy("MockV3Aggregator", {
      log: true,
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      blockConfirmations: 1,
    });
    log("Mocks deployed successfully!");
    log("--------------------------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
