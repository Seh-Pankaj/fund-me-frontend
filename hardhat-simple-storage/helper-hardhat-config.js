const networkConfig = {
  11155111: {
    name: "Sepolia",
    ethToInrPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  137: {
    name: "Polygon",
    ethToInrPriceFeed: "0xf9680d99d6c9589e2a93a78a04a279e509205945",
  },
};

const locDevChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = { networkConfig, locDevChains, DECIMALS, INITIAL_ANSWER };
