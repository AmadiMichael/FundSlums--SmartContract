const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Charity", async function () {
      let charity, deployer;

      beforeEach(async function () {
        deployer = await getNamedAccounts().deployer;
        await deployments.fixture(["all"]);
        charity = await ethers.getContract("Charity", deployer);
        const response = await charity.createFundMe(10);
        response.wait(1);
      });

      describe("createFundMe", async function () {
        it("Should push info on charity created after creating", async function () {
          const account = await ethers.getSigners();
          const amountNeeded = await charity.getCharities(0);
          console.log(amountNeeded[0]);
          assert.equal(amountNeeded[0], account[0].address);
          assert.equal(
            amountNeeded[1].toString(),
            ethers.utils.parseEther("10").toString()
          );
          assert.equal(
            amountNeeded[2].toString(),
            ethers.utils.parseEther("0").toString()
          );
          //assert.equal(amountNeeded[3], []);
          assert.equal(amountNeeded[4], true);
          assert.equal(amountNeeded[5].toString(), "0");
        });
      });

      describe("donate", async function () {
        it("Should fund", async function () {
          const account = await ethers.getSigners();
          const response = await charity.donate(0, {
            value: ethers.utils.parseEther("2"),
          });
          response.wait(1);
          const amountNeeded = await charity.getCharities(0);
          assert.equal(
            amountNeeded[2].toString(),
            ethers.utils.parseEther("2").toString()
          );
          assert.equal(amountNeeded[3][0], account[0].address);
        });
      });
    });
