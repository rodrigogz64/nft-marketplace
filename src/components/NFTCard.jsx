import { ethers } from 'ethers';
import ShareIcon from '@mui/icons-material/Share';
import '../styles/NFTCard.css';

function NFTCard({ nft, onBuy, showBuyButton = true }) {

  const shareNFT = async (nft) => {
    const shareData = {
      title: nft.name,
      text: nft.description,
      url: window.location.href
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  return (
    <div className="nft-card">
      <div className="nft-image-container">
        <img src={nft.image} alt={nft.name} className="nft-image" />
        <div className="nft-details">
          <h3>{nft.name}</h3>
          <p className="nft-description">{nft.description}</p>
          <div className="price-container">
            <span className="price-value">{ethers.utils.formatEther(nft.price)} TBNB</span>
            <div className="action-buttons">
              {showBuyButton && (
                <button className="buy-button" onClick={() => onBuy(nft)}>
                  BUY NOW
                </button>
              )}
              <button className="share-button" onClick={() => shareNFT(nft)}>
                <ShareIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;