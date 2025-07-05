import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar({ account, connectWallet }) {
  return (
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
              NFT Marketplace
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
  );
}

export default Navbar;