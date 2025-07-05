import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from '../components/NFTCard';
import { toast } from 'react-toastify';
import { marketplaceAddress, marketplaceABI } from '../config';

function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const loadMyNFTs = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);
      
      const myNFTs = await contract.fetchMyNFTs();
      console.log('MyNFTs raw:', myNFTs);

      const items = await Promise.all(myNFTs.map(async (item) => {
        const tokenURI = await contract.tokenURI(item.tokenId);
        const metadata = await fetch(tokenURI).then(res => res.json());
        
        return {
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          price: item.price,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        };
      }));

      const validItems = items.filter(item => item !== null);
      console.log('Processed NFTs:', validItems);
      setNfts(validItems);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      toast.error('Failed to load your NFTs');
    } finally {
      setLoading(false);
    }
  };

  const clearNFTs = () => {
    setNfts([]);
    setIsConnected(false);
  };

  useEffect(() => {
    checkConnection();

    window.ethereum?.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        clearNFTs();
      }
    });

    return () => {
      window.ethereum?.removeListener('accountsChanged', () => {});
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.ethereum) {
        setIsConnected(false);
        clearNFTs();
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setIsConnected(true);
        loadMyNFTs();
      } else {
        setIsConnected(false);
        clearNFTs();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
      clearNFTs();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isConnected) {
    return (
      <div className="connect-wallet-container">
        <h2>Please connect your wallet to view your NFTs</h2>
        <button className="connect-button" onClick={checkConnection}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="my-nfts-container">
      <h2>My NFTs</h2>
      {nfts.length === 0 ? (
        <div className="no-nfts">You don't own any NFTs yet</div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.tokenId}
              nft={nft}
              showBuyButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyNFTs;