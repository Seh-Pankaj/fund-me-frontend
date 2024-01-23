const { network } = require("hardhat");
const { networkConfig, locDevChains } = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethToInrPriceFeed;

  if (locDevChains.includes(network.name)) {
    const ethToInrAggregator = await deployments.get("MockV3Aggregator");
    ethToInrPriceFeed = ethToInrAggregator.address;
    console.log("MockV3Agg :", ethToInrPriceFeed);
  } else {
    ethToInrPriceFeed = networkConfig[chainId]["ethToInrPriceFeed"];
  }

  // if we want to use localhost or hardhat network we would want to use mocks to fetch prices
  const deployFundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethToInrPriceFeed],
    log: true,
    blockConfirmations: 1,
  });
  console.log("deployed FundMe !!!!!");
};

module.exports.tags = ["all", "fundme"];
