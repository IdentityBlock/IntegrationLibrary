# 'iblock-verifier'

API to integrate the personal verification middleware in the web applications.

Uses 'iBlock Mobile Application' to verify the digital identity from user's end.

<dl>

<dt><a href="https://github.com/IdentityBlock/">github repository of the project</a><dt>

</dl>

## How to use

Install the 'iblock-verifier' package on your backend server source code using

`npm install iblock-verifier`

Include the following variables in your `.env` file, or in the environment variables where your server is hosted. Refer the `.env.example` inside the 'iblock-verifier' package in the node modules folder.

`FUNDING_ACCOUNT="**private key of the account used to fund the newly created accounts **"`

Integrate the below explained functions to use the 'iBlock Person Verification Platform' in your web server.

If you are restoring the integration of 'iBlock Person Verification Platform', create a file name `deployed-contract` on your backend server with the details of your previously deployed smart contract. Refer `deployed-contract.example` file for the format.
## Functions

<dl>
<dt><a href="#loadContract">loadContract()</a> ⇒ <code>JSON</code></dt>
<dd><p>Load ( or deploy and load) the smart contract tied to the verifier.</p>
<p>Read the contract address from the &#39;deployed-contract&#39; file,
or deploy a new contract if the &#39;deployed-contract&#39; file is not present.</p>
</dd>
<dt><a href="#getQR">getQR(_verifierName)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get the QR code generated in the format accepted by the &#39;iBlock Mobile Application&#39;.</p>
</dd>
<dt><a href="#getTokenVerified">getTokenVerified(_token, _listOfDataFields)</a> ⇒ <code>JSON</code></dt>
<dd><p>Get the personal details of a user who scanned and approved a QR code with the given token.</p>
<p>If the transaction is not succeeded yet, return &quot;PENDING&quot; as status.</p>
<p>If the user has rejected permission, return &quot;REJECTED&quot; as status.</p>
</dd>
</dl>

<a name="loadContract"></a>

## loadContract() ⇒ <code>JSON</code>

Load ( or deploy and load) the smart contract tied to the verifier.

Read the contract address from the 'deployed-contract' file,
or deploy a new contract if the 'deployed-contract' file is not present.

**Kind**: global function  
**Returns**: <code>JSON</code> - {

private-key:{String} - Private key of the Ethereum Account Address of the verifier,

verifier-address: {String} - Ethereum Account Address of the verifier,

contract-address: {String} - Smart Contract address of the verifier

}.  
<a name="getQR"></a>

## getQR(\_verifierName) ⇒ <code>JSON</code>

Get the QR code generated in the format accepted by the 'iBlock Mobile Application'.

**Kind**: global function  
**Returns**: <code>JSON</code> - {

qr: {String} - QR code URI that contains the verifier details,

token: {String} - unique token to the verification

}.

| Param          | Type                | Description                                                                                                                      |
| -------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| \_verifierName | <code>String</code> | The name of the verifying institution. Will be prompted to the user who scans the QR code using the 'iBlock Mobile Application'. |

<a name="getTokenVerified"></a>

## getTokenVerified(\_token, \_listOfDataFields) ⇒ <code>JSON</code>

Get the personal details of a user who scanned and approved a QR code with the given token.

If the transaction is not succeeded yet, return "PENDING" as status.

If the user has rejected permission, return "REJECTED" as status.

**Kind**: global function  
**Returns**: <code>JSON</code> - {

status: {String} - status of the verification. "PENDING" or "APPROVED" or "REJECTED",

data(optional): {JSON} - user's data fields fetched from blockchain, only applicable if status is APPROVED.

}

| Param              | Type                              | Description                                                                                                                                                      |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \_token            | <code>String</code>               | A token previously generated using the 'iblock-verifier package' to identify the verification transaction.                                                       |
| \_listOfDataFields | <code>Array.&lt;String&gt;</code> | A list of data fields of users which need to be fetched from the blockchain currently allows the set of ["name","email","DOB","country","mobile","gender"] only. |
