import { ConnectButton as ThirdwebConnect } from "thirdweb/react";
import { client } from "../lib/web3";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export default function WalletConnector() {
  return (
    <div className="flex justify-end p-6">
      <ThirdwebConnect
        client={client}
        wallets={wallets}
        theme={"dark"}
        connectButton={{
          label: "Awaken Wallet",
          className: "!bg-linear-to-r !from-kawaii-pink !to-kawaii-blue !text-kawaii-purple !font-bold !rounded-full !shadow-[0_0_20px_rgba(255,183,226,0.5)] hover:!scale-105 active:!scale-95 !transition-all !border-none !px-8",
        }}
      />
    </div>
  );
}
