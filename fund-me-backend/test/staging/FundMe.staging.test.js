const { parseEther } = require("ethers");
const { getNamedAccounts, ethers, network } = require("hardhat");
const { locDevChains } = require("../../helper-hardhat-config.js");
const { assert } = require("chai");

// we run these test after we have deployed the code
locDevChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe;
      let deployer;
      const sendValue = parseEther("0.1");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.cheaperWithdraw();
        const endingBalance = await ethers.provider.getBalance(
          await fundMe.getAddress()
        );
        assert.equal(endingBalance.toString(), "0");
      });
    });
