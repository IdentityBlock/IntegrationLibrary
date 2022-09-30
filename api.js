const qrgen = require('qrcode');

function request(info, data) {
    /*
        Function provided to third-party service providers.
        info : Name of the organization (String)
        data : Data fields requested by the third-party service provider
    */
    console.log(typeof(data));

    if (typeof(info) != "string") {
        return "info must be a string";
    }

    if (typeof(info) != "object") {
        return "info must be an object";
    }

    return core(info, data);
}

function generateQR(token, data) {
    let qr;

    let qrData = '["Token":"' + token + '"' + ',"Information":' + JSON.stringify(data) + ']';

    //console.log(qrData);

    qrgen.toDataURL(qrData, function (err, url) {
        if (err) {
            console.log("Error generating QR code");
        }
        qr = url;
    });

    return qr;
}

function requestData() {

}

function core(info, data) {
    let token = generateToken(info);
    let qr = generateQR(token, data);

    return qr;
}

function generateToken(info) {
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + 't' + cTime;

    return dateTime + info;
}

console.log(request("ABCBank", ["Name", "Email"]));