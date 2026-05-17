import { http, createConfig, fallback } from 'wagmi';
import { mainnet, bsc, polygon, base, arbitrum, optimism, avalanche } from 'wagmi/chains';
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
    1: { name: "Ethereum", symbol: "ETH", explorer: "https://etherscan.io" },
    137: { name: "Polygon", symbol: "POL", explorer: "https://polygonscan.com" },
    8453: { name: "Base", symbol: "ETH", explorer: "https://basescan.org" },
    42161: { name: "Arbitrum", symbol: "ETH", explorer: "https://arbiscan.io" },
    10: { name: "Optimism", symbol: "ETH", explorer: "https://optimistic.etherscan.io" },
    43114: { name: "Avalanche", symbol: "AVAX", explorer: "https://snowtrace.io" },
    56: { name: "BSC", symbol: "BNB", rpc: "https://rpc.ankr.com/bsc", explorer: "https://bscscan.com" }
  };

  const info = metadata[chainId] || {};

  return { 
      id: chainId,
      rpc: rpc || info.rpc || `https://${chainId}.rpc.thirdweb.com`, // Fallback to thirdweb rpc if no alchemy/hardcoded
      nativeCurrency: {
        name: info.symbol || "Native",
        symbol: info.symbol || "Native",
        decimals: 18
      },
      blockExplorers: info.explorer ? [
        {
          name: "Main",
          url: info.explorer
        }
      ] : undefined
  } as const;
};

export const client = createThirdwebClient({
  clientId: (import.meta.env.VITE_THIRDWEB_CLIENT_ID as string) || "bf4a84623953aa84d093c94a50aa59a9",
});

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon, base, arbitrum, optimism, avalanche],
  transports: {
    [mainnet.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
    [bsc.id]: http(),
    [polygon.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
    [base.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
    [arbitrum.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
    [optimism.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
    [avalanche.id]: fallback([
      http(IS_ALCHEMY_VALID ? `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
      http(),
    ]),
  },
});
