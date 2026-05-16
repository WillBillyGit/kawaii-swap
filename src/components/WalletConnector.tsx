import { ConnectButton as ThirdwebConnect } from "thirdweb/react";
import { client } from "../lib/web3";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ExternalLink } from "lucide-react";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export default function WalletConnector() {
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <div className="flex flex-col items-end p-6 gap-2">
      <ThirdwebConnect
        client={client}
        wallets={wallets}
        theme={"dark"}
        connectButton={{
          label: "Awaken Wallet",
          className: "!bg-linear-to-r !from-kawaii-pink !to-kawaii-blue !text-kawaii-purple !font-bold !rounded-full !shadow-[0_0_20px_rgba(255,183,226,0.5)] hover:!scale-105 active:!scale-95 !transition-all !border-none !px-8",
        }}
      />
      
      {isIframe && (
        <a 
          href={window.location.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-kawaii-blue/60 flex items-center gap-1 hover:text-kawaii-blue transition-colors font-bold uppercase tracking-wider"
        >
          <ExternalLink size={10} />
          Open in New Tab for MetaMask
        </a>
      )}
    </div>
  );
}
