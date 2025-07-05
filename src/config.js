export const marketplaceAddress = "0x6Ee69FE54Fde472C88796502a6228eaF31a74F53";

export const marketplaceABI = [
  "function createToken(string memory tokenURI, uint256 price) public payable returns (uint)",
  "function createMarketSale(uint256 tokenId) public payable",
  "function fetchMarketItems() public view returns (tuple(uint256 tokenId, address payable seller, address payable owner, uint256 price, bool sold)[] memory)",
  "function fetchMyNFTs() public view returns (tuple(uint256 tokenId, address payable seller, address payable owner, uint256 price, bool sold)[] memory)",
  "function getListingPrice() public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event MarketItemCreated(uint256 indexed tokenId, address seller, address owner, uint256 price, bool sold)"
];