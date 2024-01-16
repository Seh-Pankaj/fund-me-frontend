// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
// require("dotenv").config();

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract -----------");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.waitForDeployment();
  console.log(`Contract deployed at : ${await simpleStorage.getAddress()}`);

  const currVal = await simpleStorage.retrieve();
  console.log("Your current value is : " + currVal);

  const storeRes = await simpleStorage.store(56);
  await storeRes.wait(1);
  const updateVal = await simpleStorage.retrieve();
  console.log("Your updated value is : %s", updateVal);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
