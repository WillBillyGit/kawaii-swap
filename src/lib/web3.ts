import { http, createConfig } from 'wagmi';
import { mainnet, bsc, polygon, base, arbitrum } from 'wagmi/chains';
import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: (import.meta.env.VITE_THIRDWEB_CLIENT_ID as string) || "671fb4618e470870933bd6a09633e72c",
});

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon, base, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
  },
});
