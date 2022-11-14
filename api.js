const qrgen = require("qrcode");
const fs = require("fs");
const deployContract = require("./contract");
const getVerifiedToken = require("./contract");

async function request(info, data, callback) {
  /*
        Function provided to third-party service providers.
        info : Name of the organization (String)
        data : Data fields requested by the third-party service provider
    */

  //if (typeof(info) != "string") {
  //return "info must be a string";
  //}

  /*if (typeof(info) != "object") {
        return "info must be an object";
    }*/

  return core(info, data, callback);
}

async function generateQR(token, data) {
  /*
        Generate a QR code with the given information
    */
  let qr;

  let qrData =
    '{"verifier-name": ' +
    '"Verifier Name"' +
    ' , "verifier-contract": ' +
    '"0xA726829e464caF30adB61CC5DFa0417206d71903"' +
    ' , "token": ' +
    '"New Sample Token"' +
    "}";

  //console.log(qrData);

  //qrgen.toDataURL(qrData, function (err, url) {
  //if (err) {
  //console.log("Error generating QR code");
  //}
  //console.log(url);
  //qr = url;
  //});

  return await qrgen.toDataURL(qrData);
}

async function requestData(data) {
  outData = {};
  sample = sampleData();

  for (let x in data) {
    outData[data[x]] = sample[data[x]];
  }

  let myPromise = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, 5000);
  });

  await myPromise;

  return outData;
}

async function core(info, data, callback) {
  let token = generateToken(info);
  let qr = await generateQR(token, data);

  callback({}, qr);

  return await requestData(data);
}

function generateToken(info) {
  /*
        Generate a token with the given information
    */
  let current = new Date();
  let cDate =
    current.getFullYear() +
    "-" +
    (current.getMonth() + 1) +
    "-" +
    current.getDate();
  let cTime =
    current.getHours() +
    ":" +
    current.getMinutes() +
    ":" +
    current.getSeconds();
  let dateTime = cDate + "t" + cTime;

  return dateTime + info;
}

function sampleData() {
  return { Name: "ABC", Address: "A, B, C" };
}

//request("Bank", ["Name", "Address"], function(err, data) {console.log(data)}).then(function(res) {console.log(res)});
//console.log(request("abc", ["a", "b"]));

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

async function getVerifiedUserAddressFromToken(_token) {
  const contractAddress = await JSON.parse(
    fs.readFileSync("./deployed-contract", {
      encoding: "utf8",
    })
  );

  return getVerifiedToken(
    _token,
    contractAddress["verifier-address"],
    contractAddress["contract-address"]
  ).then((response) => {
    return response;
  });
}

exports.request = request;
exports.loadContract = loadContract;
exports.getVerifiedUserAddressFromToken = getVerifiedUserAddressFromToken;

// loadContract().then(console.log);

// getVerifiedUserAddressFromToken("NewToken").then(console.log);
