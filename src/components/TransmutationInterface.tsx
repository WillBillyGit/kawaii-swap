import { useState, ChangeEvent, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Zap, Coins, Info, Plus, ShieldCheck, ArrowRightLeft, Loader2 } from "lucide-react";
import { PayEmbed, useActiveAccount, useActiveWalletChain, useReadContract, useSendTransaction } from "thirdweb/react";
import { client, getThirdwebChain } from "../lib/web3";
import { ethereum } from "thirdweb/chains";
import { NATIVE_TOKEN_ADDRESS, getContract, prepareContractCall, toEther, toWei, readContract, defineChain } from "thirdweb";

type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
};

const VAULT_ADDRESSES: Record<number, string> = {
  137: "0xB961BC2BB845821993E7A243E2Ef46aF491F2754",
  8453: "0x7012707D4c71b15D952f4c7fDE1D68d57cd76E33",
  56: "0xB961BC2BB845821993E7A243E2Ef46aF491F2754",
  10: "0xB961BC2BB845821993E7A243E2Ef46aF491F2754",
  43114: "0x86B89ecCE514895BB33C52e77726Ea15cEf6be7f",
  42161: "0x43cE86aD54fb9c154752a4a4aFb94AfFCFa46BF0",
};

const INITIAL_TOKENS: Token[] = [
  { address: NATIVE_TOKEN_ADDRESS, name: "Ethereum", symbol: "ETH", decimals: 18, chainId: 1 },
  { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", name: "Polygon Ecosystem Token", symbol: "POL", decimals: 18, chainId: 137 },
  { address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", name: "Wrapped AVAX", symbol: "WAVAX", decimals: 18, chainId: 43114 },
];

export default function TransmutationInterface() {
  const [activeTab, setActiveTab] = useState<'transmute' | 'vault' | 'tokens'>('transmute');
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [showAddToken, setShowAddToken] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [vaultAmount, setVaultAmount] = useState("");
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  
  const [isResonating, setIsResonating] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const [dismissWarning, setDismissWarning] = useState(false);
  
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  
  const nativeSymbol = activeChain?.nativeCurrency?.symbol || "ETH";

  const vaultAddress = activeChain ? VAULT_ADDRESSES[activeChain.id] : undefined;
  
  // Use a fallback contract to prevent hooks from crashing when activeChain or vaultAddress is missing
  const contract = getContract({
    client,
    chain: defineChain(getThirdwebChain(activeChain?.id || 1)),
    address: vaultAddress || "0x0000000000000000000000000000000000000000",
  });

  const { data: essenceBalance, isLoading: isLoadingEssence } = useReadContract({
    contract,
    method: "function essenceBalance(address) view returns (uint256)",
    params: [activeAccount?.address || ""],
    queryOptions: { enabled: !!vaultAddress && !!activeAccount }
  });

  const { data: virtualEssence, isLoading: isLoadingVirtual } = useReadContract({
    contract,
    method: "function getVirtualEssence(address) view returns (uint256)",
    params: [activeAccount?.address || ""],
    queryOptions: { enabled: !!vaultAddress && !!activeAccount }
  });

  const { data: tributeRate, isLoading: isLoadingTribute } = useReadContract({
    contract,
    method: "function getTributeRate(address) view returns (uint256)",
    params: [activeAccount?.address || ""],
    queryOptions: { enabled: !!vaultAddress && !!activeAccount }
  });

  const { mutate: sendTx, isPending: isTxPending } = useSendTransaction();

  const handleResonate = async () => {
    if (!vaultAddress || !vaultAmount) return;
    setIsResonating(true);
    try {
      const tx = prepareContractCall({
        contract,
        method: "function manifest() payable",
        value: toWei(vaultAmount),
      });
      await sendTx(tx);
    } finally {
      setIsResonating(false);
    }
  };

  const handleAscend = async () => {
    if (!vaultAddress || !vaultAmount) return;
    setIsAscending(true);
    try {
      const tx = prepareContractCall({
        contract,
        method: "function dissolve(uint256)",
        params: [toWei(vaultAmount)],
      });
      await sendTx(tx);
    } finally {
      setIsAscending(false);
    }
  };

  const addToken = async () => {
    if (!newTokenAddress.startsWith("0x") || newTokenAddress.length !== 42) {
      setTokenError("Invalid address");
      return;
    }
    if (!activeChain) {
      setTokenError("Chain not connected");
      return;
    }

    setIsAddingToken(true);
    setTokenError(null);
    
    try {
      // Use getThirdwebChain to potentially use Alchemy RPC
      const chain = getThirdwebChain(activeChain.id);
      
      const tokenContract = getContract({
        client,
        chain: defineChain(chain),
        address: newTokenAddress,
      });

      const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all([
        readContract({
          contract: tokenContract,
          method: "function name() view returns (string)",
          params: []
        }) as Promise<unknown> as Promise<string>,
        readContract({
          contract: tokenContract,
          method: "function symbol() view returns (string)",
          params: []
        }) as Promise<unknown> as Promise<string>,
        readContract({
          contract: tokenContract,
          method: "function decimals() view returns (uint8)",
          params: []
        }) as Promise<unknown> as Promise<number>,
      ]);

      const newToken: Token = {
        address: newTokenAddress,
        name: tokenName,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        chainId: activeChain.id
      };
      
      setTokens(prev => [...prev, newToken]);
      setNewTokenAddress("");
      setShowAddToken(false);
    } catch (error) {
      console.error("Failed to fetch token metadata:", error);
      setTokenError("Failed to fetch token data");
    } finally {
      setIsAddingToken(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-6 relative px-4 pb-20">
      {/* Title Section */}
      <div className="text-center mb-4">
        <motion.img 
          src="/mamakt.jpg"
          alt="Kawaii Swap Multi-Chain Transmutation Bridge"
          className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Identity Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        {activeAccount ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-white/80">
              Greetings, Alchemist <span className="text-kawaii-pink">{activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
              Identity Required: Please connect your wallet...
            </span>
          </div>
        )}
      </motion.div>

      {/* Main Card */}
      <motion.div 
        layout
        className={`rounded-[32px] p-1 overflow-hidden transition-all duration-700 border ${
          activeTab === 'vault' 
            ? 'bg-linear-to-br from-[#1a0a2e] to-[#2d1b4d] border-kawaii-lavender/30 shadow-[0_0_40px_rgba(209,183,255,0.15)]' 
            : activeTab === 'tokens'
            ? 'bg-white/5 border-kawaii-blue/20'
            : 'bg-white/5 border-white/10'
        } glass-card`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex bg-white/5 p-2 rounded-t-[31px] overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('transmute')}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold whitespace-nowrap ${activeTab === 'transmute' ? 'bg-white/15 text-kawaii-pink' : 'text-white/40 hover:text-white/60'}`}
          >
            <Zap size={18} /> Transmute
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold whitespace-nowrap ${activeTab === 'vault' ? 'bg-white/15 text-kawaii-gold' : 'text-white/40 hover:text-white/60'}`}
          >
            <ShieldCheck size={18} /> Vault
          </button>
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold whitespace-nowrap ${activeTab === 'tokens' ? 'bg-white/15 text-kawaii-blue' : 'text-white/40 hover:text-white/60'}`}
          >
            <Coins size={18} /> Tokens
          </button>
        </div>

        <div className="p-4 bg-white/5 min-h-[420px]">
          {activeTab === 'transmute' ? (
            activeAccount && activeChain ? (
              <PayEmbed 
                client={client}
                theme="dark"
                payOptions={{
                    buyWithCrypto: {
                      prefillSource: {
                          chain: defineChain(getThirdwebChain(activeChain.id)),
                          token: {
                              address: tokens[0].address,
                              name: tokens[0].name,
                              symbol: tokens[0].symbol,
                          }
                      }
                    },
                    buyWithFiat: false
                }}
                className="!bg-transparent !border-none !shadow-none !w-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-kawaii-pink/10 flex items-center justify-center text-kawaii-pink">
                  <Zap size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Circle of Transmutation</h3>
                  <p className="text-white/40 text-sm">Please connect your identity to initiate flow</p>
                </div>
              </div>
            )
          ) : activeTab === 'vault' ? (
            <div className="space-y-6">
              {/* Unsupported Network Guard */}
              {activeChain && !VAULT_ADDRESSES[activeChain.id] && !dismissWarning && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 relative"
                >
                  <Info size={16} className="text-red-400 mt-1 shrink-0" />
                  <div className="text-[10px] uppercase font-bold text-red-300 leading-tight">
                    Void Detected: The Aether Vault is not currently manifested on <span className="text-white">{activeChain.name}</span>. Please switch to a supported realm.
                  </div>
                  <button 
                    onClick={() => setDismissWarning(true)}
                    className="absolute top-2 right-2 text-white/40 hover:text-white"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Essence ({nativeSymbol})</div>
                  <div className="text-xl font-black text-kawaii-gold font-mono">
                    {isLoadingEssence ? (
                      <div className="h-7 w-20 bg-white/5 animate-pulse rounded" />
                    ) : essenceBalance ? Number(toEther(essenceBalance)).toFixed(4) : "0.0000"}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Virtual ({nativeSymbol})</div>
                  <div className="text-xl font-black text-kawaii-blue font-mono">
                    {isLoadingVirtual ? (
                      <div className="h-7 w-20 bg-white/5 animate-pulse rounded" />
                    ) : virtualEssence ? Number(toEther(virtualEssence)).toFixed(4) : "0.0000"}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-kawaii-lavender/20 flex items-center justify-center text-kawaii-lavender">
                       <Info size={14} />
                    </div>
                    <div className="text-xs font-bold">Tribute Rate</div>
                 </div>
                 <div className="text-sm font-mono text-kawaii-pink">
                    {isLoadingTribute ? (
                      <div className="h-5 w-12 bg-white/5 animate-pulse rounded" />
                    ) : tributeRate ? `${(Number(tributeRate) / 100).toFixed(2)}%` : "2.00%"}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="relative group">
                    <input 
                      type="number" 
                      placeholder="0.0" 
                      className={`w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-6 text-2xl font-black focus:outline-none focus:ring-2 transition-all ${
                        activeTab === 'vault' ? 'focus:ring-kawaii-lavender' : 'focus:ring-kawaii-gold'
                      }`}
                      value={vaultAmount}
                      onChange={(e) => setVaultAmount(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">
                       {nativeSymbol}
                    </div>
                    
                    {/* Dynamic Tribute Pre-Execution Calculator */}
                    {vaultAmount && Number(vaultAmount) > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-6 left-2 flex items-center gap-1.5"
                      >
                        <ArrowRightLeft size={10} className="text-kawaii-lavender" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                          Expected Yield: 
                          <span className="text-kawaii-gold ml-1">
                            {isLoadingTribute 
                              ? "Calculating..." 
                              : (Number(vaultAmount) * (1 - (Number(tributeRate || 200) / 10000))).toFixed(6)
                            } {nativeSymbol}
                          </span>
                        </span>
                      </motion.div>
                    )}
                 </div>

                 <div className="flex gap-4 pt-2">
                    <button 
                      onClick={handleResonate}
                      disabled={isTxPending || isResonating || !vaultAmount}
                      className="flex-[1.5] bg-linear-to-r from-kawaii-gold to-orange-400 text-kawaii-purple py-4 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-kawaii-gold/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isResonating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Manifesting Essence...
                        </>
                      ) : (
                        <>Resonate</>
                      )}
                    </button>
                    <button 
                      onClick={handleAscend}
                      disabled={isTxPending || isAscending || !vaultAmount}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all disabled:opacity-50 border border-white/10 flex items-center justify-center gap-2"
                    >
                      {isAscending ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Dissolving...
                        </>
                      ) : (
                        <>Ascend</>
                      )}
                    </button>
                 </div>
              </div>

              {!vaultAddress && (
                <div className="text-[10px] text-center text-red-400 font-bold uppercase py-2">
                  Vault not deployed on this chain
                </div>
              )}

              <div className="text-center pt-8 pb-4 space-y-4">
                <p className="text-white/40 text-[10px] italic font-serif leading-relaxed px-4">
                  "To know the truth of the Vault, one must first become the Essence it binds."
                </p>
                <motion.img 
                  src="/regenerated_image_1778459087673.png"
                  alt="Alchemist's Workshop"
                  className="w-32 h-32 mx-auto rounded-2xl shadow-xl border border-white/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </div>
            </div>
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
                    className={`w-full bg-black/40 border ${tokenError ? 'border-red-500/50' : 'border-kawaii-pink/30'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-kawaii-pink`}
                    value={newTokenAddress}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setNewTokenAddress(e.target.value);
                      setTokenError(null);
                    }}
                  />
                  {tokenError && (
                    <div className="text-[10px] text-red-400 font-bold px-4">{tokenError}</div>
                  )}
                  <button 
                    onClick={addToken}
                    disabled={isAddingToken || !newTokenAddress}
                    className="w-full bg-kawaii-pink text-kawaii-purple py-2 rounded-xl font-bold active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAddingToken ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Fetching Metadata...
                      </>
                    ) : (
                      "Add to Grimoire"
                    )}
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
