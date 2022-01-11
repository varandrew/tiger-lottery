const Web3 = require("web3");
const hdWalletProvider = require("truffle-hdwallet-provider");
const compile = require("./compile");

const web3 = new Web3();
const log = console.log;
const { bytecode, abi } = compile.instantiateContract(
  "./contracts/Lottery.sol"
);

const terms =
  "lucky frog exotic toy load sphere release pull powder off open exist";
const netIp = "HTTP://127.0.0.1:7545";
const provider = new hdWalletProvider(terms, netIp);

log("Loading...");
web3.setProvider(provider);
log(`web3 version ${web3.version}`);

const contract = new web3.eth.Contract(abi);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  log("Deploying contract...");
  const result = await contract
    .deploy({
      data: bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  log("Contract deployed at: ", result.options.address);
};

deploy();
