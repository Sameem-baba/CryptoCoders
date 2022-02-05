const CryptoCoders = artifacts.require("./CryptoCoders.sol");

contract("CryptoCoders", (accounts) => {
  let contract;
  before(async () => {
    contract = await CryptoCoders.deployed();
  });
  it("...get deployed", async () => {
    assert.notEqual(contract, "");
  });

  it("...get's minted and added", async () => {
    const result = await contract.mint("Sameem");
    let coder = await contract.coders(0);

    assert(coder, "Sameem");
  });
});
