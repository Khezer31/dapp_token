const GalaxyCoin = artifacts.require("GalaxyCoin");
const GalaxyCoinICO = artifacts.require("GalaxyCoinICO");

module.exports = function (deployer) {
  deployer
    .deploy(GalaxyCoinICO, GalaxyCoin.address)
    .then(() => {
      return GalaxyCoin.deployed();
    })
    .then((token) => {
      return token.fundICO(GalaxyCoinICO.address);
    });
};
