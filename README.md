# 🖼️ NFT Marketplace

A decentralized marketplace for creating, buying, and selling NFTs on the Ethereum blockchain. This application allows users to connect their digital wallets, create new NFTs, and explore a collection of unique digital assets.

## 🚀 Features

- 🔗 Connect Web3 wallets (MetaMask, WalletConnect, etc.)
- 🎨 Create NFTs with metadata upload to IPFS
- 💰 Buy and sell NFTs with cryptocurrency
- 🌐 Modern and responsive UI with Material-UI
- 📱 Mobile and desktop responsive design
- 🔒 Secure transactions on the Ethereum blockchain

## 🛠️ Technologies Used

- **Frontend**: 
  - **React 19**: La última versión de la biblioteca de JavaScript para construir interfaces de usuario interactivas.
  - **Vite**: Herramienta de construcción de frontend ultra rápida que mejora significativamente la experiencia de desarrollo.

- **UI Framework**:
  - **Material-UI (MUI)**: Biblioteca de componentes de React que implementa el diseño Material Design de Google.
  - **Emotion**: Biblioteca de CSS-in-JS que permite estilos dinámicos con JavaScript.

- **Blockchain**:
  - **ethers.js**: Biblioteca completa para interactuar con la blockchain de Ethereum y sus ecosistemas.
  - **web3modal**: Biblioteca modular que permite la conexión con diferentes proveedores de billeteras web3.

- **Storage**:
  - **IPFS**: Sistema de almacenamiento descentralizado que permite almacenar archivos y datos de manera distribuida.

- **Enrutamiento**:
  - **React Router DOM**: Biblioteca estándar para el enrutamiento en aplicaciones React.

- **Manejo de Estado**:
  - **React Hooks**: Permite usar el estado y otras características de React sin escribir clases.

- **Notificaciones**:
  - **React Toastify**: Biblioteca para mostrar notificaciones atractivas y personalizables.

- **Otras Herramientas**:
  - **Axios**: Cliente HTTP basado en promesas para realizar peticiones a APIs.
  - **Buffer**: Módulo para manejar datos binarios en Node.js y el navegador.
  - **React Dropzone**: Componente para manejar la carga de archivos de manera sencilla.

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rodrigogz64/nft-marketplace.git
   cd nftmarketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_PINATA_JWT
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:5173](http://localhost:5173)
