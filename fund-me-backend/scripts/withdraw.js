const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing ethers");
  const txnResponse = await fundMe.cheaperWithdraw();
  await txnResponse.wait(1);
  console.log("Withdraw successfull");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
