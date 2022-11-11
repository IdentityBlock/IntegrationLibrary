// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Verifier {
    // verifier wallet address - to restrict the access of verified personal details only to the verifier
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    // store the verified tokens and addresses of the users with that token
    mapping(string => address) verified_tokens;

    // modifier to restrict the access of verified personal details only to the verifier
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    // public function called by any user who scans the QR code
    // adds token and wallet address of the user
    function verifyToken(string memory token, address userContract)
        external
        returns (address)
    {
        verified_tokens[token] = userContract;
        return owner;
    }

    // get the wallet address of verified user by the token
    function getVerifiedUserAddress(string memory token)
        public
        view
        isOwner
        returns (address user)
    {
        return verified_tokens[token];
    }
}
