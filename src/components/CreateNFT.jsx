import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { toast } from 'react-toastify';
import { marketplaceAddress, marketplaceABI } from '../config';
import '../styles/CreateNFT.css';

function CreateNFT({ provider }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadToIPFS = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (!import.meta.env.VITE_PINATA_JWT) {
        throw new Error('Pinata JWT not found in environment variables');
      }

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const createMetadata = async (imageUrl) => {
    try {
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl
      };

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error creating metadata:', error);
      throw error;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const formatPrice = (value) => {
    if (!value) return '';
    // Eliminar ceros innecesarios al final
    return parseFloat(value).toString();
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Permitir hasta 5 decimales
    if (value.includes('.') && value.split('.')[1].length > 5) return;
    setFormData(prev => ({
      ...prev,
      price: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      
      const imageUrl = await uploadToIPFS(formData.image);
      toast.info('Image uploaded to IPFS');
      const tokenURI = await createMetadata(imageUrl);
      toast.info('Metadata created on IPFS');
      const signer = provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);
      
      const listingPrice = await contract.getListingPrice();
      const priceInWei = ethers.utils.parseEther(formData.price.toString());
      
      const transaction = await contract.createToken(tokenURI, priceInWei, {
        value: listingPrice
      });
      
      await transaction.wait();
      
      toast.success('NFT created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Error creating NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-nft-container">
      <form className="create-nft-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter NFT name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your NFT"
          />
        </div>

        <div className="form-group">
          <label>Price (TBNB)</label>
          <input
            type="number"
            value={formData.price}
            onChange={handlePriceChange}
            placeholder="0.00000"
            step="0.00001"
          />
        </div>

        <div className="form-group">
          <label>NFT Image</label>
          <div className="dropzone">
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="image-preview" />
                <p>Click or drag to change image</p>
              </div>
            ) : (
              <div className="upload-placeholder">
                <p>Drag and drop your file here, or click to browse</p>
                <span>PNG, JPG, GIF up to 10MB</span>
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="create-button"
          disabled={loading || !formData.name || !formData.description || !formData.price || !formData.image}
        >
          {loading ? 'Creating NFT...' : 'Create NFT'}
        </button>
      </form>
    </div>
  );
}

export default CreateNFT;