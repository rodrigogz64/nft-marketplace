import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import WalletConnect from './components/WalletConnect';
import Marketplace from './components/MarketPlace';
import CreateNFT from './components/CreateNFT';
import MyNFTs from './components/MyNFTs';

function App() {
  const [provider, setProvider] = useState(null);

  return (
    <Router>
      <Box sx={{ 
        minHeight: '100vh',
        background: '#0B1120'
      }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Marketplace
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3,
              alignItems: 'center'
            }}>
              <Typography 
                component={Link} 
                to="/marketplace" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: 'white' }
                }}
              >
                MARKETPLACE
              </Typography>
              
              <Typography 
                component={Link} 
                to="/create-nft" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: 'white' }
                }}
              >
                CREATE NFT
              </Typography>
              
              <Typography 
                component={Link} 
                to="/my-nfts" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': { color: 'white' }
                }}
              >
                MY NFTS
              </Typography>

              <WalletConnect onProviderChange={setProvider} />
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 8, pb: 8 }}>
          <Routes>
            <Route path="/" element={<Marketplace provider={provider} />} />
            <Route path="/marketplace" element={<Marketplace provider={provider} />} />
            <Route path="/create-nft" element={<CreateNFT provider={provider} />} />
            <Route path="/my-nfts" element={<MyNFTs provider={provider} />} />
          </Routes>
        </Container>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Box>
    </Router>
  );
}

export default App;