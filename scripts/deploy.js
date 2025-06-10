const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const SpoofToken = await hre.ethers.getContractFactory("Token");
  console.log("Contract factory created...");

  const token = await SpoofToken.deploy();
  console.log("Contract transaction sent, waiting for deployment...");

  await token.waitForDeployment();
  console.log("Contract deployment confirmed.");

  const address = await token.getAddress();
  console.log("SpoofToken deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});