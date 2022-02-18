import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import Web3 from 'web3/dist/web3.min.js'

import { CONTACT_ABI } from '../abi/abi.js';


const contractAddress = '0x10580a0428bf14c12E223e9cC2C281De667A332C';

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
          <h4 class="titulo">Total minteado {totalMinted}/20000</h4>
          <h1 class="titulo">Pretty Funckies Token final</h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-3 p-2">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {

  const contentId = 'QmZJwMpCwXy56fYELABUSA76MyviN6nrvF8K69womDKNhW';
  const metadataURI = `https://gateway.pinata.cloud/ipfs/QmPgv7HincTCBVBZigJUxaC1QDG3u8t3zdYnHtkfD8qUqY/${tokenId}`;
  const imageURI = `https://ipfs.io/ipfs/${contentId}/${tokenId}.png`;
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
    <div className="card" style={{ width: '15rem' }}>
      <img className="card-img-top" src={isMinted ? imageURI : 'https://i.postimg.cc/WbHqjHB9/placeholder.jpg'}></img>
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
