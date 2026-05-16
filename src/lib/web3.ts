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
  if (rpc) {
      return {
          id: chainId,
          rpc: rpc
      } as const;
  }
  return { id: chainId } as const;
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
