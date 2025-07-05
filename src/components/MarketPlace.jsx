import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { marketplaceAddress, marketplaceABI } from '../config';
import NFTCard from './NFTCard';
import { useTransaction } from '../hooks/useTransaction';
import { LoadingState } from './LoadingState';


function Marketplace({ provider }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { executeTransaction, isProcessing } = useTransaction();

  useEffect(() => {
    if (provider) {
      loadNFTs();
    } else {
      setNfts([]);
      setLoading(false);
    }
  }, [provider]);

  const loadNFTs = async () => {
    try {
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);
      const data = await contract.fetchMarketItems();
      console.log('Raw market items:', data);

      const items = await Promise.all(
        data.map(async (item) => {
          try {
            const tokenUri = await contract.tokenURI(item.tokenId);
            const meta = await fetch(tokenUri).then(res => res.json());
            
            return {
              tokenId: item.tokenId.toString(),
              seller: item.seller,
              owner: item.owner,
              price: item.price.toString(),
              name: meta.name,
              description: meta.description,
              image: meta.image
            };
          } catch (err) {
            console.error('Error processing item:', err);
            return null;
          }
        })
      );

      const validItems = items.filter(item => item !== null);
      console.log('Processed items:', validItems);
      setNfts(validItems);
    } catch (err) {
      console.error('Error loading NFTs:', err);
      toast.error('Unable to load NFTs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleBuyNFT = async (nft) => {
    try {
      toast.info('Please confirm the transaction in your wallet...', {
        autoClose: false,
        toastId: 'transaction-pending'
      });
      
      await executeTransaction(
        async () => {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);
          return await contract.createMarketSale(nft.tokenId, {
            value: nft.price
          });
        },
        {
          onSuccess: () => {
            toast.dismiss('transaction-pending');
            toast.success('NFT purchased successfully!');
            loadNFTs();
          },
          onError: (error) => {
            toast.dismiss('transaction-pending');
            if (error.code === 'ACTION_REJECTED') {
              toast.info('Transaction cancelled by user');
            } else if (error.message?.includes('insufficient funds')) {
              toast.error('Insufficient funds to complete this purchase');
            } else if (error.message?.includes('user rejected')) {
              toast.info('Transaction rejected by user');
            } else {
              toast.error('Failed to purchase NFT. Please try again.');
            }
          }
        }
      );
    } catch (error) {
      console.error('Buy NFT error:', error);
      toast.dismiss('transaction-pending');
      if (error.code === 'ACTION_REJECTED') {
        toast.info('Transaction cancelled by user');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };
  return (
    <Box sx={{ p: 4 }}>
      {loading ? (
        <LoadingState message="Loading NFTs..." />
      ) : (
        <>
          {nfts.length === 0 ? (
            <div className="no-nfts">You don't own any NFTs yet</div>
          ) : (
            <div className="nft-grid">
              {nfts.map((nft) => (
                <NFTCard
                key={nft.tokenId}
                nft={nft}
                onBuy={handleBuyNFT}
                disabled={isProcessing}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Box>
  );
}

export default Marketplace;