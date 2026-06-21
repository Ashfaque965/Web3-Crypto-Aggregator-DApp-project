import hardhat from "hardhat";

async function main() {
  const { ethers } = hardhat;
  const [deployer] = await ethers.getSigners();
  console.log("Deploying InvestmentVault with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  const investmentVaultFactory = await ethers.getContractFactory("InvestmentVault");
  const investmentVault = await investmentVaultFactory.deploy();

  await investmentVault.waitForDeployment();
  const deployedAddress = await investmentVault.getAddress();

  console.log("InvestmentVault deployed to:", deployedAddress);
  console.log("Set NEXT_PUBLIC_INVESTMENT_VAULT_ADDRESS=", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});