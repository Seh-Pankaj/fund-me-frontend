import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library PriceConverter {
    function getPrice(
        AggregatorV3Interface customPriceFeed
    ) internal view returns (uint256) {
        // ABI
        // Address of the oracle
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     customPriceFeed
        // );
        (, int256 price, , , ) = customPriceFeed.latestRoundData();
        // ETH in terms of USD
        // 3000.00000000
        return uint256(price * 1e10);
    }

    function getVersion() internal view returns (uint256) {
        // AggregatorV3Interface --> this is the oracle interface
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        return priceFeed.version();
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        return (ethPrice * ethAmount) / 1e18;
    }
}
