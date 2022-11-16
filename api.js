const qrgen = require("qrcode");
const fs = require("fs");
const crypto = require("crypto");

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
 *
 * @returns the address of the smart contract related to the caller of the function.
 * If the caller has no smart contract deployed for him,
 *    function creates a new Ethereum account for user,
 *    deploys a new contract from the newly created account,
 *    and returns the address of the new smart contract.
 */
async function loadContract() {
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
 *
 * @param {String} _verifierName The name of the verifying institution.
 * Will be prompted to the user who scans the QR code.
 * @returns QR code URI that contains the details in the format accepts by the iBlock mobile application
 */
async function getQR(_verifierName) {
  const deployedContract = await JSON.parse(
    fs.readFileSync("./deployed-contract", {
      encoding: "utf8",
    })
  );

  const token =
    new Date().toISOString() +
    crypto
      .getTokenVerified(
        "2022-11-16T09:08:24.173Zc76a65e4203bd790d8d47f6d3dcb59a5bb8ba2b97a5",
        ["name", "email", "gender"]
      )
      .then(console.log);
  randomBytes(22).toString("hex");
  const qrData =
    '{"verifier-name": "' +
    _verifierName +
    '" , "verifier-contract": "' +
    deployedContract["contract-address"] +
    '" , "token": "' +
    token +
    '"}';

  return await qrgen.toDataURL(qrData);
}

/**
 *
 * @param {String} _token a token previously generated using the iBlock API to identify the verification transaction
 * @param {String[]} _listOfDataFields a list of data fields of users which need to be fetched from the blockchain
 * currently allows the set of ["name","email","DOB","country","mobile","gender"] only.
 * @returns personal data JSON object of the user who approved to share his personal details for the given token issuer.
 * If the user rejected the permission, 'REJECTED' is returned,
 * If the user has not approved or rejected yet, 'PENDING' is returned.
 */
async function getTokenVerified(_token, _listOfDataFields) {
  const deployedContract = await JSON.parse(
    fs.readFileSync("./deployed-contract", {
      encoding: "utf8",
    })
  );

  const response = await getVerifiedToken(
    _token,
    deployedContract["verifier-address"],
    deployedContract["contract-address"]
  );

  if (response == "PENDING" || response == "REJECTED") {
    return response;
  }
  let data = {};

  for (let _field in _listOfDataFields) {
    let field = _listOfDataFields[_field].toLowerCase();
    switch (field) {
      case "name":
        data[field] = await getUserName(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "email":
        data[field] = await getUserEmail(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "dob":
        data[field] = await getUserDOB(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "country":
        data[field] = await getUserCountry(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "mobile":
        data[field] = await getUserMobile(
          response,
          deployedContract["verifier-address"]
        );
        break;
      case "gender":
        data[field] = await getUserGender(
          response,
          deployedContract["verifier-address"]
        );
        break;
      default:
        data[field] = "cannot fetch from iblock API";
    }
  }
  return data;
}

exports.loadContract = loadContract;
exports.getQR = getQR;
exports.getTokenVerified = getTokenVerified;
