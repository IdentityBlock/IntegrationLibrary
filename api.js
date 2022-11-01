const qrgen = require('qrcode');

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

function generateQR(token, data) {
    /*
        Generate a QR code with the given information
    */
    let qr;

    let qrData = '["Token":"' + token + '"' + ',"Information":' + JSON.stringify(data) + ']';

    //console.log(qrData);

    qrgen.toDataURL(qrData, function (err, url) {
        if (err) {
            console.log("Error generating QR code");
        }
        //console.log(url);
        qr = url;
    });

    return qr;
}

async function requestData(data) {
    outData = {}
    sample = sampleData();

    for (let x in data) {
        outData[data[x]] = sample[data[x]];
    }

    let myPromise = new Promise(function(resolve) {
        setTimeout(function() {resolve();}, 5000);
    });

    await myPromise;

    return outData;
}

async function core(info, data, callback) {
    let token = generateToken(info);
    let qr = generateQR(token, data);

    callback({}, qr);

    return await requestData(data);
}

function generateToken(info) {
    /*
        Generate a token with the given information
    */
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + 't' + cTime;

    return dateTime + info;
}

function sampleData() {
    return {"a" : "abc", "b" : "bcd"};
}

request("a", ["b"], function(err, data) {console.log(data)}).then(function(res) {console.log(res)});
//console.log(request("abc", ["a", "b"]));