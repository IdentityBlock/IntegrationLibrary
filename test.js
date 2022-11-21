// Requiring module
const assert = require('assert');
const {
    deployContract,
    getVerifiedToken,
    getUserName,
    getUserEmail,
    getUserDOB,
    getUserCountry,
    getUserMobile,
    getUserGender,
  } = require("./contract.js");
  
describe("Unit testing of contract.js", () => {
  before(() => {
    console.log( "Starting" );
  });
  
  after(() => {
    console.log( "Testing done" );
  });
      
  describe( "getUserName function", () => {
    beforeEach(() => {
      console.log( "Starting getUserName testing" );
    });
      
    it("Test 1", async () => {
      assert.equal(await getUserName("0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1", "0xe43FD05d7E2257e2265099cf5Fe87602a6DEfE91"), "Kasun Isuranga");
    });
  });
  
  describe( "getUserEmail function", () => {
    beforeEach(() => {
      console.log( "Starting getUserEmail testing" );
    });
      
    it("Test 1", async () => {
      assert.equal(await getUserEmail("0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1", "0xe43FD05d7E2257e2265099cf5Fe87602a6DEfE91"), "kasunisuranga.19@cse.mrt.ac.lk");
    });
  });

  describe( "getUserDOB function", () => {
    beforeEach(() => {
      console.log( "Starting getUserDOB testing" );
    });
      
    it("Test 1", async () => {
      assert.equal(await getUserDOB("0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1", "0xe43FD05d7E2257e2265099cf5Fe87602a6DEfE91"), "2000-01-12");
    });
  });
  
  describe( "getUserCountry function", () => {
    beforeEach(() => {
      console.log( "Starting getUserCountry testing" );
    });
      
    it("Test 1", async () => {
      assert.equal(await getUserCountry("0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1", "0xe43FD05d7E2257e2265099cf5Fe87602a6DEfE91"), "Sri Lanka");
    });
  });

  describe( "getUserMobile function", () => {
    beforeEach(() => {
      console.log( "Starting getUserMobile testing" );
    });
      
    it("Test 1", async () => {
      assert.equal(await getUserMobile("0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1", "0xe43FD05d7E2257e2265099cf5Fe87602a6DEfE91"), "+94711009825");
    });
  });
  
  describe( "getUserGender function", () => {
    beforeEach(() => {
      console.log( "Starting getUserGender testing" );
    });
      
    it("Test 1", async () => {
      assert.equal(await getUserGender("0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1", "0xe43FD05d7E2257e2265099cf5Fe87602a6DEfE91"), "Male");
    });
  });
});

getUserName("0x417fB7b824D97f4554aD61A97d254c24f7C84d20", "0x6102Fb1Caea3Ab5ED5a8Ac844BdB7F28bc8363D1").then((data) => {
        console.log(data)
    }
);