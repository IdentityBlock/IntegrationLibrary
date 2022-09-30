const qrgen = require('qrcode');

function request(info, data) {
    return core(info, data);
}

async function generateQR(token, data) {
    let qr;

    //data["token"] = token;
    const qrData = '{"token":"' + token + '"' + ',"information":' + JSON.stringify(data) + '}';

    //console.log(JSON.stringify(data));

    let qrCode = await qrgen.toDataURL(qrData);
    return qrCode;
}

function requestData() {

}

function core(info, data) {
    let token = generateToken(info);
    let qr = generateQR(token, data);

    //console.log(qr);

    return qr;
}

function generateToken(info) {
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + 't' + cTime;

    return dateTime + info;
}

//console.log(request("abc", ["a", "b"]));

module.exports = {
    request
};