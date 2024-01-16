const { assert, expect } = require("chai");
const { parseEther } = require("ethers");
const { deployments, getNamedAccounts, network } = require("hardhat");
const { ethers } = require("hardhat");
const { locDevChains } = require("../../helper-hardhat-config.js");

!locDevChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe;
      let deployer;
      let MockV3Aggregator;
      const sendValue = parseEther("1.1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", async function () {
        it("Sets the aggregator address correctly", async function () {
          const response = await fundMe.getPriceFeed();
          const mockV3Add = await MockV3Aggregator.getAddress();
          assert.equal(response, mockV3Add);
        });
      });

      describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "Not enough amount sent"
          );
        });

        it("maps address to funds correctly", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });

        it("adds funder to the funders list", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getFunder(0);
          assert.equal(response, deployer);
        });
      });

      describe("Withdraw ori", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });

        it("can withdraw ETH", async function () {
          // Arrange
          const startFundMeBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const startDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          const tnxResponse = await fundMe.withdraw();
          const txnReceipt = await tnxResponse.wait(1);

          const endFundMeBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const endDeployerBalance = await ethers.provider.getBalance(deployer);

          const startContDepBalance =
            BigInt(startDeployerBalance) + BigInt(startFundMeBalance);

          const gasCost = BigInt(txnReceipt.fee);

          const endDepandGasCost = BigInt(endDeployerBalance) + BigInt(gasCost);

          // Assert
          assert.equal(endFundMeBalance, 0);
          assert.equal(
            startContDepBalance.toString(),
            endDepandGasCost.toString()
          );
        });

        it("does not let attacker to withdraw ETH", async function () {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await ethers.getContract(
            "FundMe",
            attacker
          );
          await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });
      });

      describe("cheap Withdraw defined", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });

        it("can withdraw ETH", async function () {
          // Arrange
          const startFundMeBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const startDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          const tnxResponse = await fundMe.cheaperWithdraw();
          const txnReceipt = await tnxResponse.wait(1);

          const endFundMeBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const endDeployerBalance = await ethers.provider.getBalance(deployer);

          const startContDepBalance =
            BigInt(startDeployerBalance) + BigInt(startFundMeBalance);

          const gasCost = BigInt(txnReceipt.fee);

          const endDepandGasCost = BigInt(endDeployerBalance) + BigInt(gasCost);

          // Assert
          assert.equal(endFundMeBalance, 0);
          assert.equal(
            startContDepBalance.toString(),
            endDepandGasCost.toString()
          );
        });

        it("does not let attacker to withdraw ETH", async function () {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await ethers.getContract(
            "FundMe",
            attacker
          );
          await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });
      });
    });
