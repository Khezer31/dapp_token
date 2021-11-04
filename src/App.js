import logo from "./logo.svg";
import "./App.css";
import getWeb3 from "./getWeb3";
import { useEffect, useState } from "react";
import GalaxyCoin from "./abis/GalaxyCoin.json";

function App() {
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [totalSupp, setTotalSupp] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [web3, setWeb3] = useState(undefined);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GalaxyCoin.networks[networkId];
      const instance = new web3.eth.Contract(
        GalaxyCoin.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setAddress(accounts[0]);
      setContract(instance);
      setWeb3(web3);
      _getMaxSupply(instance);
      _getBalanceOf(instance, accounts[0]);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const _getMaxSupply = async (contractInstance) => {
    const response = await contractInstance.methods
      .totalSupply()
      .call({ from: address });
    setTotalSupp(response);
  };

  const _getBalanceOf = async (contractInstance, account) => {
    try {
      const response = await contractInstance.methods
        .balanceOf(account)
        .call();
      setBalance(response);
    } catch (err) {
      console.log(err);
    }
  };

  const _sendCoin = async () => {
    try {
      const response = await contract.methods
        .transfer(toAddress, web3.utils.toBN(10000000000000000000))
        .send({ from: address });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <h1>Galaxy Coin</h1>
      <div>Your address : {address}</div>
      <div>Your Supply : {balance / 10 ** 18} GLX</div>
      <div>Max Supply : {totalSupp / 10 ** 18} GLX</div>
      <button onClick={_getMaxSupply}>Get Balance</button>
      <div>
        <div>Send coin to </div>
        <input
          type="text"
          value={toAddress}
          onChange={(t) => setToAddress(t.target.value)}
        />
        <button onClick={_sendCoin}>Send</button>
      </div>
    </div>
  );
}

export default App;
