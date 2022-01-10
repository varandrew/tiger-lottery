import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/Lottery.json";
import { ethers } from "ethers";
import logo from "./assets/logo.png";

const contractAddress = "0x0E68A4294Ed863b1131D3075366ec4E2E299E458";
const abi = contract.abi;

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
    console.log(
      "🚀 ~ file: App.js ~ line 112 ~ betHandler ~ contract",
      contract
    );
    await contract.bet();
    setFlag(true);
  };

  const LotteryContent = () => {
    return (
      <div className="app-content">
        <p>MANGER ADDRESS:</p>
        <p className="display-text">{currentManger}</p>
        <p>MY ADDRESS: </p>
        <p className="display-text">{currentAccount}</p>
        <p>{currentPlayerCount} PERSON PARTICIPATED</p>

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
      <div className="app-wrapper">
        <h1 className="yellow">Tiger Lottery</h1>
        <img src={logo} alt="tiger-logo" />
        <div>{currentAccount ? LotteryContent() : connectWalletButton()}</div>
      </div>
    </div>
  );
}

export default App;
