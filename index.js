const solc = require("solc");
const fs = require("fs");
const Web3 = require("web3");

// Setting up a HttpProvider
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

const compileContract = () => {
  // Reading the contract file
  const file = fs.readFileSync("verifier_contract.sol").toString();

  // Input structure for solidity compiler
  const input = {
    language: "Solidity",
    sources: {
      "verifier_contract.sol": {
        content: file,
      },
    },

    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  const ABI = output.contracts["verifier_contract.sol"]["Verifier"].abi;
  const bytecode =
    output.contracts["verifier_contract.sol"]["Verifier"].evm.bytecode.object;

  return { ABI, bytecode };
};

const deployContract = () => {
  const { ABI, bytecode } = compileContract();
  const contract = new web3.eth.Contract(ABI);

  web3.eth.getAccounts().then((accounts) => {
    // Display all Ganache Accounts
    console.log("Accounts:", accounts);

    const mainAccount = accounts[0];

    // address that will deploy smart contract
    console.log("Default Account:", mainAccount);

    contract
      .deploy({ data: bytecode })
      .send({ from: mainAccount, gas: 470000 })
      .on("receipt", (receipt) => {
        // Contract Address will be returned here
        console.log("Contract Address:", receipt.contractAddress);
        fs.writeFileSync("contract_address", receipt.contractAddress);
        return receipt.contractAddress;
      });
  });
};

if (fs.existsSync("contract_address")) {
  console.log("already deployed");
  const contractAddress = fs.readFileSync("contract_address", {
    encoding: "utf8",
  });
  console.log("fetched contractAddress:", contractAddress);
} else {
  console.log("to be deployed");

  const deployedAddress = deployContract();

  console.log("deployed then fetched contractAddress:", deployedAddress);
}
