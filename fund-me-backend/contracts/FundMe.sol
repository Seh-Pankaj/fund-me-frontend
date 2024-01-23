// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error FundMe__NotOwner();

// NatSpec for this contract
/**
 * @title This is a fund me contract
 * @author Pankaj Sehrawat
 * @notice This contract is used to collect funds from various parties
 * @dev This section is for developers to explain below technical
 */
contract FundMe {
    // This is a type declaration
    /* IMPORTANT FOR USING LIBRARIES */
    using PriceConverter for uint256;

    // these are state variables
    uint256 public constant MINIMUM_USD = 1 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // only called by owner
        // require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address customPriceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(customPriceFeed);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    // @param -> define the parameters passed to the function
    // @return -> what data type it returns
    /**
     * @notice This is the contract which updates funders list
     * @dev This function contains a require statement
     */
    function fund() public payable {
        // this function should send a minimum amount in USD
        // 1. How do we send ETH to this contract?
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Not enough amount sent"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        // reset the funders array
        s_funders = new address[](0);

        // 3 ways to actually withdraw funds
        // transfer
        payable(msg.sender).transfer(address(this).balance);
        // send
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success, "Withdraw failed");
        // call
        // (bool callSuccess /*bytes memory dataReceived*/, ) = payable(msg.sender)
        //     .call{value: address(this).balance}("");
        // require(callSuccess, "Withdraw call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (
            uint funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Withdraw failed");
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
