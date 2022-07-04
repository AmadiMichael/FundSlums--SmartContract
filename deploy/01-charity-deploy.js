const { developmentChains } = require("../helper-hardhat-config");
const { network, deployments } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const Charity = await deploy("Charity", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name)) {
    await verify(Charity.address, []);
  }

  log("________________________________________");
};

module.exports.tags = ["all", "Charity"];
