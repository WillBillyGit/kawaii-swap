import { useState, ChangeEvent } from "react";
import { motion } from "motion/react";
import { Sparkles, Zap, Coins, Info, Plus } from "lucide-react";
import { PayEmbed } from "thirdweb/react";
import { client } from "../lib/web3";
import { ethereum, polygon, avalanche } from "thirdweb/chains";

type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
};

const INITIAL_TOKENS: Token[] = [
  { address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "Ethereum", symbol: "ETH", decimals: 18, chainId: 1 },
  { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", name: "Polygon Ecosystem Token", symbol: "POL", decimals: 18, chainId: 137 },
  { address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", name: "Wrapped AVAX", symbol: "WAVAX", decimals: 18, chainId: 43114 },
];

export default function TransmutationInterface() {
  const [activeTab, setActiveTab] = useState<'transmute' | 'tokens'>('transmute');
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [showAddToken, setShowAddToken] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState("");

  const addToken = () => {
    if (!newTokenAddress.startsWith("0x")) return;
    // Mock adding - in a real app would fetch metadata
    const dummy: Token = {
      address: newTokenAddress,
      name: "Custom Token",
      symbol: "CUST",
      decimals: 18,
      chainId: 1
    };
    setTokens([...tokens, dummy]);
    setNewTokenAddress("");
    setShowAddToken(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-6 relative px-4 pb-20">
      {/* Title Section */}
      <div className="text-center space-y-2 mb-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold rainbow-text font-sans tracking-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          KAWAII SWAP
        </motion.h1>
        <p className="text-kawaii-blue/80 font-medium text-sm tracking-widest uppercase">
          Multi-Chain Transmutation Bridge
        </p>
      </div>

      {/* Main Card */}
      <motion.div 
        layout
        className="glass-card rounded-[32px] p-1 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex bg-white/5 p-2 rounded-t-[31px]">
          <button 
            onClick={() => setActiveTab('transmute')}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold ${activeTab === 'transmute' ? 'bg-white/15 text-kawaii-pink' : 'text-white/40 hover:text-white/60'}`}
          >
            <Zap size={18} /> Transmute
          </button>
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold ${activeTab === 'tokens' ? 'bg-white/15 text-kawaii-blue' : 'text-white/40 hover:text-white/60'}`}
          >
            <Coins size={18} /> Tokens
          </button>
        </div>

        <div className="p-4 bg-white/5 min-h-[400px]">
          {activeTab === 'transmute' ? (
            <PayEmbed 
              client={client}
              theme="dark"
              payOptions={{
                  buyWithCrypto: {
                    prefillSource: {
                        chain: ethereum,
                        token: {
                            address: tokens[0].address,
                            name: tokens[0].name,
                            symbol: tokens[0].symbol,
                        }
                    }
                  }
              }}
              className="!bg-transparent !border-none !shadow-none !w-full"
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-kawaii-lavender flex items-center gap-2">
                  <Sparkles size={16} /> Grimoire of Tokens
                </h3>
                <button 
                  onClick={() => setShowAddToken(!showAddToken)}
                  className="p-2 bg-kawaii-pink/20 hover:bg-kawaii-pink/40 rounded-full text-kawaii-pink transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showAddToken && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-2"
                >
                  <input 
                    type="text" 
                    placeholder="Enter Contract Address" 
                    className="w-full bg-black/40 border border-kawaii-pink/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-kawaii-pink"
                    value={newTokenAddress}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTokenAddress(e.target.value)}
                  />
                  <button 
                    onClick={addToken}
                    className="w-full bg-kawaii-pink text-kawaii-purple py-2 rounded-xl font-bold active:scale-95 transition-all text-sm"
                  >
                    Add to Grimoire
                  </button>
                </motion.div>
              )}

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {tokens.map((token: Token, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-kawaii-pink/20 to-kawaii-blue/20 flex items-center justify-center font-black text-kawaii-pink">
                        {token.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{token.name}</div>
                        <div className="text-[10px] text-white/40 font-mono">{token.address.slice(0,6)}...{token.address.slice(-4)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-bold text-kawaii-blue">{token.symbol}</div>
                       <div className="text-[10px] text-white/30 uppercase tracking-tighter">Chain ID: {token.chainId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Footnote */}
      <div className="flex items-center justify-center gap-3 text-[10px] text-kawaii-gold font-bold uppercase tracking-tighter">
        <div className="w-10 h-[1px] bg-kawaii-gold/30" />
        <span className="flex items-center gap-1">
          <Info size={12} /> HARNESS THE POWER OF TIME-WEIGHTED LIQUIDITY
        </span>
        <div className="w-10 h-[1px] bg-kawaii-gold/30" />
      </div>

      {/* Floating Badges */}
      <div className="absolute -left-12 top-1/4 animate-float opacity-40 hidden lg:block">
        <div className="bg-white/10 rounded-full p-4 border border-white/20 blur-[1px]">
          <div className="w-8 h-8 rounded-full bg-kawaii-pink flex items-center justify-center text-kawaii-purple font-black">?</div>
        </div>
      </div>
    </div>
  );
}
