const GalaxyCoin = artifacts.require("GalaxyCoin");

module.exports = function (deployer) {
  deployer.deploy(GalaxyCoin,"Galaxy Coin","GLX");
};
