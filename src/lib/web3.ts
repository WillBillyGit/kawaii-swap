import { http, createConfig, fallback } from 'wagmi';
import { mainnet, bsc, polygon, base, arbitrum, optimism, avalanche, sepolia } from 'wagmi/chains';
import { createThirdwebClient } from "thirdweb";

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
const IS_ALCHEMY_VALID = ALCHEMY_KEY && ALCHEMY_KEY.length > 10;

export const getThirdwebChain = (chainId: number) => {
  const alchemyUrls: Record<number, string> = {
    1: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    137: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    8453: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    42161: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    10: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    43114: `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  };

  const rpc = IS_ALCHEMY_VALID ? alchemyUrls[chainId] : undefined;
  
  // Define basic metadata to avoid unnecessary network calls
  const metadata: Record<number, any> = {
    1: { name: "Ethereum", symbol: "ETH", explorer: "https://etherscan.io", rpc: "https://eth.llamarpc.com" },
    137: { name: "Polygon", symbol: "POL", explorer: "https://polygonscan.com", rpc: "https://polygon-rpc.com" },
    8453: { name: "Base", symbol: "ETH", explorer: "https://basescan.org", rpc: "https://mainnet.base.org" },
    42161: { name: "Arbitrum", symbol: "ETH", explorer: "https://arbiscan.io", rpc: "https://arb1.arbitrum.io/rpc" },
    10: { name: "Optimism", symbol: "ETH", explorer: "https://optimistic.etherscan.io", rpc: "https://mainnet.optimism.io" },
    43114: { name: "Avalanche", symbol: "AVAX", explorer: "https://snowtrace.io", rpc: "https://api.avax.network/ext/bc/C/rpc" },
    56: { name: "BSC", symbol: "BNB", explorer: "https://bscscan.com", rpc: "https://rpc.ankr.com/bsc" },
    11155111: { name: "Sepolia", symbol: "ETH", explorer: "https://sepolia.etherscan.io", rpc: "https://rpc.sepolia.org" }
  };

  const info = metadata[chainId] || {};

  return { 
      id: chainId,
      name: (info.name as string) || `Chain ${chainId}`,
      rpc: (rpc || info.rpc || `https://rpc.ankr.com/eth`) as string, 
      nativeCurrency: {
        name: (info.symbol as string) || "Native",
        symbol: (info.symbol as string) || "Native",
        decimals: 18
      },
      blockExplorers: info.explorer ? [
        {
          name: "Main",
          url: info.explorer as string
        }
      ] : undefined,
      // Adding these to satisfy some SDK requirements that might be checking for them
      rpcUrls: {
        default: {
            http: [rpc || info.rpc || `https://rpc.ankr.com/eth`]
        },
        public: {
            http: [rpc || info.rpc || `https://rpc.ankr.com/eth`]
        }
      }
  };
};

export const client = createThirdwebClient({
  clientId: (import.meta.env.VITE_THIRDWEB_CLIENT_ID as string) || "bf4a84623953aa84d093c94a50aa59a9",
});

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon, base, arbitrum, optimism, avalanche, sepolia],
  transports: {
    [mainnet.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
    [bsc.id]: http("https://rpc.ankr.com/bsc"),
    [polygon.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http("https://polygon-rpc.com"),
      http(),
    ]),
    [base.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http("https://mainnet.base.org"),
      http(),
    ]),
    [arbitrum.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http("https://arb1.arbitrum.io/rpc"),
      http(),
    ]),
    [optimism.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http("https://mainnet.optimism.io"),
      http(),
    ]),
    [avalanche.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http("https://api.avax.network/ext/bc/C/rpc"),
      http(),
    ]),
    [sepolia.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http("https://rpc.sepolia.org"),
      http(),
    ]),
  },
});
