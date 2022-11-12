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

  const transaction = await verifierContract.deploy({
    data: contract.bytecode,
  });

  const options = {
    data: transaction.encodeABI(),
    gas: 3000000,
    gasPrice: "3000000000000",
  };

  const signed = await web3.eth.accounts.signTransaction(
    options,
    account.privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return {
    "private-key": account.privateKey,
    "contract-address": receipt.contractAddress,
  };
};

module.exports = deployContract;
