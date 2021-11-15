import logo from "./logo.svg";
import getWeb3 from "./getWeb3";
import { useEffect, useState } from "react";
import GalaxyCoin from "./abis/GalaxyCoin.json";
import GalaxyCoinICO from "./abis/GalaxyCoinICO.json";
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from "@mui/core/ButtonUnstyled";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import ShoppingCartImage from "@mui/icons-material/ShoppingCart";
import TransferImage from "@mui/icons-material/SyncAlt";
import { styled } from "@mui/system";
import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

const CustomButtonRoot = styled("button")`
  background-color: #007fff;
  padding: 15px 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 0 rgba(0, 127, 255, 0);
  border: none;

  &:hover {
    background-color: #0059b2;
  }

  &.${buttonUnstyledClasses.active} {
    background-color: #004386;
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1),
      0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: 0 0 0 0 rgba(0, 127, 255, 0);
  }
`;

function App() {
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [ICOContract, setICOContract] = useState(null);
  const [ICOContractAddress, setICOContractAddress] = useState("");
  const [totalSupp, setTotalSupp] = useState(0);
  const [toAddress, setToAddress] = useState(
    "0x3aC690091dA46111d83C224A3294Bcd01d60D4BD"
  );
  const [balance, setBalance] = useState(0);
  const [balanceICO, setBalanceICO] = useState(0);
  const [web3, setWeb3] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [eventArray, setEventArray] = useState([]);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      setWeb3(web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      setAddress(accounts[0]);
      const networkId = await web3.eth.net.getId();

      // Instantiate GLX Contract
      const deployedNetwork = GalaxyCoin.networks[networkId];
      const instance = new web3.eth.Contract(
        GalaxyCoin.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(instance);

      // Instantiate ICO-GLX Contract
      const deployedNetworkICO = GalaxyCoinICO.networks[networkId];
      const ICOInstance = new web3.eth.Contract(
        GalaxyCoinICO.abi,
        deployedNetworkICO && deployedNetworkICO.address
      );
      setICOContract(ICOInstance);
      setICOContractAddress(deployedNetworkICO.address);

      const res = await ICOInstance.methods._rate().call({ from: address });
      setRate(res);

      _getMaxSupply(instance);
      const myBalance = await _getBalanceOf(instance, accounts[0]);
      setBalance(myBalance);
      const balabceOfIco = await _getBalanceOf(
        instance,
        deployedNetworkICO.address
      );
      setBalanceICO(balabceOfIco);

      // Get Past Transfer event filter by receive address of current user.
      const pastEvents = await instance.getPastEvents("Transfer", {
        filter: {
          to: accounts[0],
        },
        fromBlock: 0,
        toBlock: "latest",
      });
      setEventArray(pastEvents);

      // Listener of Transfer's event filter by receive address of current user.
      instance.events
        .Transfer({
          filter: {
            to: accounts[0],
          },
        })
        .on("data", (event) => {
          setEventArray((eventArray) => [...eventArray, event]);
          setOpen(true);
        })
        .on("error", console.error);
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
      const response = await contractInstance.methods.balanceOf(account).call();
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const _sendCoin = async () => {
    try {
      const response = await contract.methods
        .transfer(toAddress, web3.utils.toBN(10000000000000000000))
        .send({ from: address });
    } catch (err) {
      console.log(err);
    }
  };

  const _burnToken = async () => {
    try {
      const response = await contract.methods
        .burnGalaxy(500)
        .send({ from: address });
    } catch (err) {
      console.log(err);
    }
  };

  const _buyToken = async () => {
    try {
      const response = await web3.eth.sendTransaction({
        to: ICOContractAddress,
        from: address,
        value: web3.utils.toWei(quantity, "ether"),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const _withdraw = async () => {
    try {
      const response = await ICOContract.methods
        .withdraw()
        .send({ from: address });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="h3" fontWeight="bold">
        GalaxyCoin
      </Typography>
      
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={8} md={8} lg={8}>
            <Card style={{ marginBottom: 16 }} elevation={0}>
              <CardContent>
                <Typography variant="h6">Informations</Typography>
                <Typography>Your address : {address}</Typography>
                <Typography>
                  Your Supply : {Math.round(balance / 10 ** 18)} GLX
                </Typography>
                <Typography>
                  Supply ICO : {Math.round(balanceICO / 10 ** 18)} GLX
                </Typography>
                <Typography>
                  Total Supply : {Math.round(totalSupp / 10 ** 18)} GLX
                </Typography>
                <ButtonUnstyled
                  style={{ margin: 8, backgroundColor: "#ffa726" }}
                  onClick={() => _getMaxSupply(contract)}
                  component={CustomButtonRoot}
                >
                  Refresh Total Supply
                </ButtonUnstyled>
              </CardContent>
            </Card>
            <Card style={{ marginBottom: 16 }} elevation={0}>
              <CardContent>
                <Typography variant="h6">Buy Galaxy Token</Typography>
                <Typography>Price : 1 ETH = {rate} GLX</Typography>
                <div>
                  <TextField
                    style={{ marginRight: 16 }}
                    label="Quantity"
                    type="number"
                    id="filled-size-small"
                    defaultValue="Small"
                    variant="outlined"
                    size="small"
                    value={quantity}
                    onChange={(t) => setQuantity(t.target.value)}
                  />
                  <ButtonUnstyled
                    style={{ backgroundColor: "#388e3c" }}
                    onClick={_buyToken}
                    component={CustomButtonRoot}
                  >
                    Buy
                  </ButtonUnstyled>
                </div>
              </CardContent>
            </Card>
            <Card style={{ marginBottom: 16 }} elevation={0}>
              <CardContent>
                <Typography variant="h6">Transfer coin</Typography>
                <div>
                  <TextField
                    style={{ marginRight: 16 }}
                    label="Ethereum Address"
                    type="text"
                    id="filled-size-small"
                    defaultValue="Small"
                    variant="outlined"
                    size="small"
                    value={toAddress}
                    onChange={(t) => setToAddress(t.target.value)}
                  />
                  <ButtonUnstyled
                    onClick={_sendCoin}
                    component={CustomButtonRoot}
                  >
                    Send
                  </ButtonUnstyled>
                </div>
              </CardContent>
            </Card>
            <ButtonUnstyled onClick={_burnToken} component={CustomButtonRoot}>
              Burn500
            </ButtonUnstyled>
            <ButtonUnstyled onClick={_withdraw} component={CustomButtonRoot}>
              Withdraw ETH
            </ButtonUnstyled>
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
            <Card style={{ marginBottom: 16 }} elevation={0}>
              <CardContent>
                <Typography variant="h6">Pasted Events</Typography>
                <div>
                  <List sx={{ maxHeight: 300, overflow: "auto" }}>
                    {eventArray.map((event, key) => {
                      return (
                        <ListItem key={key}>
                          <ListItemAvatar>
                            <Avatar>
                              {event.returnValues.from ===
                              ICOContractAddress ? (
                                <ShoppingCartImage />
                              ) : (
                                <TransferImage />
                              )}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              event.returnValues.from === ICOContractAddress
                                ? "ICO Buy"
                                : "Transfer"
                            }
                            secondary={
                              Math.round(event.returnValues.value / 10 ** 18) +
                              " GLX"
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Transfer success"
      />
    </div>
  );
}

export default App;
