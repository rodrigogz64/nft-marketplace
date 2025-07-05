import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LaunchIcon from '@mui/icons-material/Launch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/WalletConnect.css';

function WalletConnect({ onProviderChange }) {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [provider, setProvider] = useState(null);
  const menuRef = useRef();

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        onProviderChange(provider);

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await handleAccountsChanged(accounts);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const updateBalance = async (accountAddress) => {
    if (window.ethereum && accountAddress) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accountAddress);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      const newAccount = accounts[0];
      setAccount(newAccount);
      await updateBalance(newAccount);
    }
  };

  const handleChainChanged = async () => {
    if (window.ethereum && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      onProviderChange(provider);
      await updateBalance(account);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
        }).then(() => window.ethereum.request({
          method: 'eth_requestAccounts'
        }));

        localStorage.setItem('walletConnected', 'true');
        await handleAccountsChanged(accounts);
      } else {
        toast.error('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    setAccount('');
    setBalance('');
    localStorage.removeItem('walletConnected');
    onProviderChange(null);
    setIsMenuOpen(false);
    
    if (window.ethereum && window.ethereum.removeAllListeners) {
      window.ethereum.removeAllListeners();
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="wallet-container" ref={menuRef}>
      {!account ? (
        <button className="wallet-button" onClick={connectWallet}>
          <AccountBalanceWalletIcon className="wallet-icon" />
          <span>Connect Wallet</span>
      </button>
      ) : (
        <>
          <button className="wallet-button connected" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <AccountBalanceWalletIcon className="wallet-icon" />
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </button>

          {isMenuOpen && (
            <div className="wallet-menu">
              <div className="menu-header">
                <div className="header-row">
                  <div className="network-badge">
                    BSC Testnet
                  </div>
                  <div className="connection-status">
                    <span className="status-dot"></span>
                    Connected
                  </div>
                </div>
              </div>

              <div className="balance-box">
                <span className="balance-label">Balance</span>
                <div className="balance-amount">
                  {parseFloat(balance).toFixed(4)} TBNB
                </div>
              </div>

              <div className="menu-items">
                <button className="menu-item" onClick={() => {
                  window.open(`https://testnet.bscscan.com/address/${account}`, '_blank');
                  setIsMenuOpen(false);
                }}>
                  <LaunchIcon sx={{ fontSize: 18, marginRight: '8px' }} />
                  View on Explorer
                </button>

                <button className="menu-item" onClick={() => {
                  navigator.clipboard.writeText(account);
                  toast.success('Address copied!');
                  setIsMenuOpen(false);
                }}>
                  <ContentCopyIcon sx={{ fontSize: 18, marginRight: '8px' }} />
                  Copy Address
                </button>

                <button className="menu-item disconnect" onClick={handleDisconnect}>
                  <LogoutIcon sx={{ fontSize: 18, marginRight: '8px' }} />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WalletConnect;