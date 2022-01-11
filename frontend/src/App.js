import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { styled } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import DiamondIcon from "@mui/icons-material/Diamond";
import contract from "./contracts/Lottery.json";
import Logo from "./assets/logo.png";
import "./App.css";

const contractAddress = "0xffFF59d8992712473d852eed6D5f08A9c5554365";
const abi = contract.abi;

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

function App() {
  const [flag, setFlag] = useState(true);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentManger, setCurrentManager] = useState(null);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [currentBalance, setCurrentBalance] = useState("0");
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [currentIssue, setCurrentIssue] = useState(0);
  const [currentPlayerCount, setCurrentPlayerCount] = useState(0);

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  useEffect(() => {
    (async () => {
      if (flag === false) return setFlag(true);

      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);

          const issue = await contract.issue();
          const manger = await contract.manager();
          const winner = await contract.winner();
          const balance = await contract.getBalance();
          const players = await contract.getPlayers();
          const count = await contract.getPlayersCount();

          setContract(contract);
          setCurrentIssue(issue.toNumber());
          setCurrentManager(manger);
          setCurrentWinner(winner);
          setCurrentBalance(ethers.utils.formatEther(balance));
          setCurrentPlayers(players);
          setCurrentPlayerCount(count.toNumber());
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [flag, currentAccount]);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const betHandler = async () => {
    if (!contract) return;

    const tx = await contract.bet({
      from: currentAccount,
      value: ethers.utils.parseEther("1"),
      gasLimit: "3000000",
    });

    await tx.wait();
    setFlag(true);
  };

  const drawHandler = async () => {
    if (!contract) return;

    const tx = await contract.draw({
      from: currentAccount,
      gasLimit: "3000000",
    });

    await tx.wait();
    setFlag(true);
  };

  const LotteryContent = () => {
    return (
      <div className="app-content">
        <Typography mt={2} variant="h6" gutterBottom component="div">
          MANGER ADDRESS:
        </Typography>
        <Div>{currentManger}</Div>
        <Typography variant="h6" gutterBottom component="div">
          MY ADDRESS:
        </Typography>
        <Div>{currentAccount}</Div>
        <Typography mt={2} variant="overline" display="block" gutterBottom>
          {currentPlayerCount} PERSON PARTICIPATED
        </Typography>

        <div style={{ alignSelf: "center", textAlign: "center" }}>
          <div
            style={{
              color: "red",
              fontSize: "48px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            {currentBalance} ETH
          </div>
          <div>PRIZE POOL</div>
        </div>

        <div
          style={{
            alignSelf: "center",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ color: "blue", fontSize: "48px", fontWeight: "bold" }}>
            ISSUE {currentIssue}
          </div>
        </div>

        <button onClick={betHandler} className="cta-button bet-button">
          BET
        </button>
      </div>
    );
  };

  return (
    <div className="main-app">
      <Card className="app-wrapper">
        <h1 className="yellow">Tiger Lottery</h1>
        <img src={Logo} alt="tiger-logo" />
        <div>{currentAccount ? LotteryContent() : connectWalletButton()}</div>
      </Card>

      <Fab
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        color="secondary"
        aria-label="edit"
      >
        <DiamondIcon onClick={drawHandler} />
      </Fab>
    </div>
  );
}

export default App;
