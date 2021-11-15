const web3 = require("web3");
const {
  utils: { toWei },
} = web3;

const GalaxyCoin = artifacts.require("GalaxyCoin");
const GalaxyCoinICO = artifacts.require("GalaxyCoinICO");

contract("GalaxyToken", (accounts) => {

  it("distributes token supply", async () => {
    const token = await GalaxyCoin.deployed();

    // accounts[0] is the same address that created the GalaxyCoin:
    const founderBalance = await token.balanceOf.call(accounts[0]);

    // Make sure it holds all of the supply:
    assert.equal(founderBalance.toString(), 25000 * 10 ** 18);
  });



  it("can buy tokens", async () => {
    const galaxyTokenInstance = await GalaxyCoin.deployed();
    const galaxyTokenICOInstance = await GalaxyCoinICO.deployed();

    const userAddr = accounts[1]; // A random account that we control
    const wei = toWei("1", "ether"); // We need to specify the value in wei

    await galaxyTokenICOInstance.sendTransaction({
      from: userAddr,
      value: wei,
    });

    const userBalance = await galaxyTokenInstance.balanceOf.call(userAddr);

    assert.equal(userBalance.toString(), 2700 * 10 ** 18);

    const icoBalance = await galaxyTokenInstance.balanceOf.call(galaxyTokenICOInstance.address);

    assert.equal(icoBalance.toString(), 72300 * 10 ** 18);
  });
  
});
