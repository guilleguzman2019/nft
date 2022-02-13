import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import Web3 from 'web3/dist/web3.min.js'

import { CONTACT_ABI } from '../abi/abi.js';


const contractAddress = '0xBa1391333c8389607a69Bc5bbdb12395C9782d35';

const web3 = new Web3(window.ethereum);

var accounts
var balance
var price




const contract = new web3.eth.Contract(
  CONTACT_ABI.abi,
  contractAddress
)




function Home() {

  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.methods.count().call();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
      <WalletBalance />

      <div class="container">
        <div class="row justify-content-center">
          <h1>Pretty Funckies</h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-4">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {

  const contentId = 'QmbVrwdJjmpDWL3TNeTXRXgjaCn6FVdduCknTR2s7xLmJe';
  const metadataURI = `https://ipfs.io/ipfs/QmZY12ShZkNfjQGpDyvGuRczsxpY2KKKhhj1QQ7FTuSXkH/${tokenId}`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
//   const imageURI = `img/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.methods.isContentOwned(metadataURI).call();
    console.log(result)
    setIsMinted(result);
  };

  const mintToken = async () => {

    price = await contract.methods.PRICE().call();

    accounts = await web3.eth.getAccounts();

    //const connection = contract.connect(signer);
    //const addr = connection.address;
    const result = await contract.methods.mint(accounts[0], metadataURI)
    .send({ from: accounts[0], gas: 0, value: price  })

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.methods.tokenURI(tokenId).call();
    alert(uri);
  }
  return (
    <div className="card" style={{ width: '18rem' }}>
      <img className="card-img-top" src={isMinted ? imageURI : 'https://i.pinimg.com/736x/48/5d/34/485d3490861e058d4af3c69c7f41eb2d.jpg'}></img>
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );

}

export default Home;
