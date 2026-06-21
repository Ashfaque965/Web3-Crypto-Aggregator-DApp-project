import hardhat from "hardhat";

async function main() {
  const contractAddress = process.env.INVESTMENT_VAULT_ADDRESS;

  if (!contractAddress) {
    throw new Error("Set INVESTMENT_VAULT_ADDRESS in your environment before verification.");
  }

  await hardhat.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
  });

  console.log("InvestmentVault verified:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
