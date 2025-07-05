import { useState, useEffect } from 'react';

export function useNetwork(provider) {
  const [network, setNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const SUPPORTED_CHAIN_ID = '0x61';

  useEffect(() => {
    if (provider) {
      checkNetwork();
      window.ethereum.on('chainChanged', checkNetwork);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      }
    };
  }, [provider]);

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
      setIsCorrectNetwork(chainId === SUPPORTED_CHAIN_ID);
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SUPPORTED_CHAIN_ID }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await addBSCTestnet();
      }
    }
  };

  return { network, isCorrectNetwork, switchNetwork };
}