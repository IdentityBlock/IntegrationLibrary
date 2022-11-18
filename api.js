const qrgen = require("qrcode");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const {
  deployContract,
  getVerifiedToken,
  getUserName,
  getUserEmail,
  getUserDOB,
  getUserCountry,
  getUserMobile,
  getUserGender,
} = require("./contract");

/**
 * Check for the verifier contract address details in the .env
 * @returns {Bool}
 */
function isInConfigs() {
  return(process.env.IBLOCK_VERIFIER_PRIVATE_KEY && process.env.IBLOCK_VERIFIER_ADDRESS && process.env.IBLOCK_VERIFIER_CONTRACT_ADDRESS)
}
/**
 * Load ( or deploy and load) the smart contract tied to the verifier.
 *
 * Read the contract address from the 'deployed-contract' file,
 * or deploy a new contract if the 'deployed-contract' file is not present.
 *
 * @returns {JSON} {
 *
 * private-key:{String} - Private key of the Ethereum Account Address of the verifier,
 *
 * verifier-address: {String} - Ethereum Account Address of the verifier,
 *
 * contract-address: {String} - Smart Contract address of the verifier
 *
 * }.
 *
 */
async function loadContract() {
  if (isInConfigs()) {
    return({"private-key": process.env.IBLOCK_VERIFIER_PRIVATE_KEY,"verifier-address": process.env.IBLOCK_VERIFIER_ADDRESS,"contract-address": process.env.IBLOCK_VERIFIER_CONTRACT_ADDRESS})
  }
  if (!fs.existsSync("./deployed-contract")) {
    return deployContract()
      .then((depObj) => {
        fs.writeFileSync("./deployed-contract", JSON.stringify(depObj));
      })
      .then(async () => {
        const contractAddress = await JSON.parse(
          fs.readFileSync("./deployed-contract", {
            encoding: "utf8",
          })
        );
        return await contractAddress;
      });
  } else {
    const contractAddress = await JSON.parse(
      fs.readFileSync("./deployed-contract", {
        encoding: "utf8",
      })
    );
    return contractAddress;
  }
}

/**
 * Get the QR code generated in the format accepted by the 'iBlock Mobile Application'.
 *
 * @param {String} _verifierName The name of the verifying institution.
 * Will be prompted to the user who scans the QR code using the 'iBlock Mobile Application'.
 *
 * @returns {JSON} {
 *
 * qr: {String} - QR code URI that contains the verifier details,
 *
 * token: {String} - unique token to the verification
 *
 * }.
 *
 */
async function getQR(_verifierName) {
  let deployedContract;
  if (isInConfigs()) {
    deployedContract = {"private-key": process.env.IBLOCK_VERIFIER_PRIVATE_KEY,"verifier-address": process.env.IBLOCK_VERIFIER_ADDRESS,"contract-address": process.env.IBLOCK_VERIFIER_CONTRACT_ADDRESS}
  }
  else {
    deployedContract = await JSON.parse(
      fs.readFileSync("./deployed-contract", {
        encoding: "utf8",
      })
      );
    }

  const token =
    new Date().toISOString() + crypto.randomBytes(22).toString("hex");
  const qrData =
    '{"verifier-name": "' +
    _verifierName +
    '" , "verifier-contract": "' +
    deployedContract["contract-address"] +
    '" , "token": "' +
    token +
    '"}';

  return { qr: await qrgen.toDataURL(qrData), token };
}

/**
 * Get the personal details of a user who scanned and approved a QR code with the given token.
 *
 * If the transaction is not succeeded yet, return "PENDING" as status.
 *
 * If the user has rejected permission, return "REJECTED" as status.
 *
 * @param {String} _token A token previously generated using the 'iblock-verifier package' to identify the verification transaction.
 * @param {String[]} _listOfDataFields A list of data fields of users which need to be fetched from the blockchain
 *
 * currently allows the set of ["name","email","DOB","country","mobile","gender"] only.
 *
 * @returns {JSON} {
 *
 * status: {String} - status of the verification. "PENDING" or "APPROVED" or "REJECTED",
 *
 * data(optional): {JSON} - user's data fields fetched from blockchain, only applicable if status is APPROVED.
 *
 * }
 *
 */
async function getTokenVerified(_token, _listOfDataFields) {
  let deployedContract;
  if (isInConfigs()) {
    deployedContract = {"private-key": process.env.IBLOCK_VERIFIER_PRIVATE_KEY,"verifier-address": process.env.IBLOCK_VERIFIER_ADDRESS,"contract-address": process.env.IBLOCK_VERIFIER_CONTRACT_ADDRESS}
  }
  else {
    deployedContract = await JSON.parse(
      fs.readFileSync("./deployed-contract", {
        encoding: "utf8",
      })
      );
    }

  const response = await getVerifiedToken(
    _token,
    deployedContract["verifier-address"],
    deployedContract["contract-address"]
  );

  if (response == "PENDING" || response == "REJECTED") {
    return { status: response };
  }
  let approvedResponse = { status: "APPROVED", data: {} };

  for (let _field in _listOfDataFields) {
    let field = _listOfDataFields[_field].toLowerCase();
    switch (field) {
      case "name":
        approvedResponse.data[field] = await getUserName(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "email":
        approvedResponse.data[field] = await getUserEmail(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "dob":
        approvedResponse.data[field] = await getUserDOB(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "country":
        approvedResponse.data[field] = await getUserCountry(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "mobile":
        approvedResponse.data[field] = await getUserMobile(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "gender":
        approvedResponse.data[field] = await getUserGender(
          response,
          deployedContract["verifier-address"]
        );
        break;
      default:
        approvedResponse.data[field] = "cannot fetch from iblock API";
    }
  }
  return approvedResponse;
}

exports.loadContract = loadContract;
exports.getQR = getQR;
exports.getTokenVerified = getTokenVerified;
