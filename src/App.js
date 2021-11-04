import logo from "./logo.svg";
import "./App.css";
import getWeb3 from "./getWeb3";
import { useEffect, useState } from "react";
import Migrations from "./abis/Migrations.json";

function App() {
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState(null);

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
      const deployedNetwork = Migrations.networks[networkId];
      const instance = new web3.eth.Contract(
        Migrations.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setAddress(accounts[0]);
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div>Your address : {address}</div>
    </div>
  );
}

export default App;
