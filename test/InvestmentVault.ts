import { expect } from "chai";
import { parseEther } from "ethers";
import hardhat from "hardhat";

describe("InvestmentVault", function () {
  async function deployFixture() {
    const { ethers } = hardhat;
    const [owner, user] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("InvestmentVault");
    const vault = await factory.deploy();
    await vault.waitForDeployment();

    return { owner, user, vault };
  }

  it("records deposits per account", async function () {
    const { user, vault } = await deployFixture();

    await vault.connect(user).deposit({ value: parseEther("1") });

    const balance = await vault.balanceOf(user.address);
    expect(balance).to.equal(parseEther("1"));
  });

  it("allows withdrawing deposited funds", async function () {
    const { user, vault } = await deployFixture();

    await vault.connect(user).deposit({ value: parseEther("2") });
    await vault.connect(user).withdraw(parseEther("1"));

    const balance = await vault.balanceOf(user.address);
    expect(balance).to.equal(parseEther("1"));
  });

  it("rejects withdrawals above balance", async function () {
    const { user, vault } = await deployFixture();

    await expect(vault.connect(user).withdraw(parseEther("1"))).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("rejects zero value deposits", async function () {
    const { user, vault } = await deployFixture();

    await expect(vault.connect(user).deposit({ value: 0n })).to.be.revertedWith("Invalid amount");
  });
});