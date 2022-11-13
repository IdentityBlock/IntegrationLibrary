const Web3 = require("web3");
require("dotenv").config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.wsUrl));

const contract = require("./bin/Verifier.json");

deployContract = async () => {
  let verifierContract = await new web3.eth.Contract(contract.abi);

  const fundingAccount = await web3.eth.accounts.privateKeyToAccount(
    process.env.fundingAccount
  );

  const account = await web3.eth.accounts.create();

  await web3.eth.sendTransaction({
    from: fundingAccount.address,
    to: account.address,
    value: 10000000000000000000, // 10**19 equivalent to 10 ether
  });

  const transaction = verifierContract.deploy({
    data: contract.bytecode,
  });

  const options = {
    data: transaction.encodeABI(),
    gas: 3000000,
  };

  const signed = await web3.eth.accounts.signTransaction(
    options,
    account.privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  return {
    "private-key": account.privateKey,
    "verifier-address": account.address,
    "contract-address": receipt.contractAddress,
  };
};

getVerifiedToken = async (
  _token,
  _verifierAccountAddress,
  _verifierSmartContractAddress
) => {
  let contractInstance = new web3.eth.Contract(
    contract.abi,
    _verifierSmartContractAddress
  );

  let userSmartContractAddress = await contractInstance.methods
    .getVerifiedUserAddress(_token)
    .call({ from: _verifierAccountAddress });

  if (userSmartContractAddress === "0x0000000000000000000000000000000000000000")
    return false;
  return userSmartContractAddress;
};

// deployContract().then(console.log);

// getVerifiedToken(
//   "NewToken",
//   "0x1b73553c039EC59685E0428Df32230dfC0441887",
//   "0xA726829e464caF30adB61CC5DFa0417206d71903"
// ).then(console.log);

module.exports = deployContract;
module.exports = getVerifiedToken;
