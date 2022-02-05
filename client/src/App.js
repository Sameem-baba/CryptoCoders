import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import CryptoCoders from "./contracts/CryptoCoders.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [coders, setCoders] = useState([]);
  const [text, setText] = useState("");

  const loadNFTS = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();

    let nfts = [];
    for (let i = 0; i < totalSupply; i++) {
      const nft = await contract.methods.coders(i).call();
      nfts.push(nft);
    }

    setCoders(nfts);
  };

  const loadWeb3Account = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    if (accounts) {
      setAccount(accounts[0]);
    }
  };

  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const networkData = CryptoCoders.networks[networkId];
    if (networkData) {
      const abi = CryptoCoders.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      return contract;
    }
  };

  useEffect(async () => {
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    let contract = await loadWeb3Contract(web3);
    await loadNFTS(contract);
  }, [getWeb3, loadWeb3Account, loadWeb3Contract, loadNFTS]);

  const mintNFTs = async () => {
    await contract.methods.mint(text).send({ from: account }, (err) => {
      console.log("Worked");
      if (!err) {
        setCoders([...coders, text]);
        setText("");
      }
    });
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Crypto Coders
          </a>
          <span>{account}</span>
        </div>
      </nav>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              className="mb-4"
              src="https://avatars.dicebear.com/api/pixel-art/sameembaba.svg"
              alt="Crpto Coders"
              width="72"
            />
            <h1 className="display-5 fw-bold">Crypto Coders</h1>
            <div className="col-6 text-center">
              <p className="lead text-center">
                These are some of the most highly motivated coders in the world!
                We are here to learn coding and apply it to the better of
                humanity. We are inventors, innovators, and creators.
              </p>
              <div className="">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  type="text"
                  placeholder="e.g. Sameem"
                  className="form-control mb-2"
                />
                <button
                  type="submit"
                  onClick={mintNFTs}
                  className="btn btn-primary"
                >
                  Mint
                </button>
              </div>
            </div>

            <div className="col-8 d-flex justify-content-center flex-wrap">
              {coders.map((coder, index) => (
                <div
                  key={index}
                  className="d-flex flex-column align-items-center"
                >
                  <img
                    src={`https://avatars.dicebear.com/api/pixel-art/${coder}.svg`}
                    alt=""
                    width="150"
                  />
                  <span>
                    {coder}.#{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
