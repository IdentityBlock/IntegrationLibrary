/**
 * Containes all the functions related to web3 integration
 * deploying and interacting with smart contract
 */

const Web3 = require("web3");
require("dotenv").config();

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.IBLOCK_WSURL)
);

const contract = require("./bin/Verifier.json");
const userContract = require("./bin/User.json");

deployContract = async () => {
  let verifierContract = await new web3.eth.Contract(contract.abi);

  const fundingAccount = await web3.eth.accounts.privateKeyToAccount(
    process.env.FUNDING_ACCOUNT
  );

  const account = await web3.eth.accounts.create();

  const initialTxSign = await web3.eth.accounts.signTransaction(
    {
      to: account.address,
      value: "500000000000000000", // equivalent to 0.5 ether
      gas: 2000000,
    },
    process.env.fundingAccount
  );
  const initialRecipt = await web3.eth.sendSignedTransaction(
    initialTxSign.rawTransaction
  );

  const transaction = await verifierContract.deploy({
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
    return "PENDING";

  return userSmartContractAddress;
};

getUserName = async (_userSmartContractAddress, _verifierAccountAddress) => {
  let contractInstance = new web3.eth.Contract(
    userContract.abi,
    _userSmartContractAddress
  );

  let userName = await contractInstance.methods
    .getName()
    .call({ from: _verifierAccountAddress });

  return userName;
};

getUserEmail = async (_userSmartContractAddress, _verifierAccountAddress) => {
  let contractInstance = new web3.eth.Contract(
    userContract.abi,
    _userSmartContractAddress
  );

  let userEmail = await contractInstance.methods
    .getEmail()
    .call({ from: _verifierAccountAddress });

  return userEmail;
};

getUserDOB = async (_userSmartContractAddress, _verifierAccountAddress) => {
  let contractInstance = new web3.eth.Contract(
    userContract.abi,
    _userSmartContractAddress
  );

  let userDOB = await contractInstance.methods
    .getDOB()
    .call({ from: _verifierAccountAddress });

  return userDOB;
};

getUserCountry = async (_userSmartContractAddress, _verifierAccountAddress) => {
  let contractInstance = new web3.eth.Contract(
    userContract.abi,
    _userSmartContractAddress
  );

  let userCountry = await contractInstance.methods
    .getCountry()
    .call({ from: _verifierAccountAddress });

  return userCountry;
};

getUserMobile = async (_userSmartContractAddress, _verifierAccountAddress) => {
  let contractInstance = new web3.eth.Contract(
    userContract.abi,
    _userSmartContractAddress
  );

  let userMobile = await contractInstance.methods
    .getMobile()
    .call({ from: _verifierAccountAddress });

  return userMobile;
};

getUserGender = async (_userSmartContractAddress, _verifierAccountAddress) => {
  let contractInstance = new web3.eth.Contract(
    userContract.abi,
    _userSmartContractAddress
  );

  let userGender = await contractInstance.methods
    .getGender()
    .call({ from: _verifierAccountAddress });

  return userGender;
};

module.exports = {
  deployContract,
  getVerifiedToken,
  getUserName,
  getUserEmail,
  getUserDOB,
  getUserCountry,
  getUserMobile,
  getUserGender,
};
