import { useState, useRef, useEffect } from "react";
import {
  useConnection,
  useConnectors,
  useConnect,
  useDisconnect,
  useEnsName,
  useChainId,
  useChains,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { sepolia, baseSepolia, anvil } from "wagmi/chains";
import { formatUnits } from "viem";

const TARGET_CHAIN_ID = sepolia.id;
const AVAILABLE_CHAINS = [sepolia, baseSepolia, anvil];

const CHAIN_EMOJI: Record<number, string> = {
  [sepolia.id]: "🔵",
  [baseSepolia.id]: "🟣",
  [anvil.id]: "🔨",
};

const WalletButton = () => {
  const { address, isConnected } = useConnection();
  const connect = useConnect();
  const connectors = useConnectors();
  const disconnect = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const chainId = useChainId();
  const chains = useChains();
  const switchChain = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const networkMenuRef = useRef<HTMLDivElement>(null);

  const hasWallet = typeof window !== "undefined" && "ethereum" in window;
  const connector = connectors[0];
  const currentChain = chains.find((c) => c.id === chainId);
  const isWrongNetwork = false; // restore to: isConnected && chainId !== TARGET_CHAIN_ID

  // Close dropdown when clicking outside — fixes the onBlur timing bug
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        networkMenuRef.current &&
        !networkMenuRef.current.contains(e.target as Node)
      ) {
        setShowNetworkMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNetworkSwitch = (targetChainId: number) => {
    switchChain.mutate({ chainId: targetChainId });
    setShowNetworkMenu(false);
  };

  const formatBalance = (decimals = 4) =>
    balance
      ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(decimals)} ${balance.symbol}`
      : `0.${"0".repeat(decimals)} ETH`;

  const formatAddress = () =>
    ensName || `${address?.slice(0, 6)}…${address?.slice(-4)}`;

  // ── NOT CONNECTED ──────────────────────────────────────────────────────────
  if (!isConnected) {
    return hasWallet ? (
      <button
        onClick={() => connect.mutate({ connector })}
        disabled={connect.isPending}
        className="
          px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wide
          bg-amber-300 text-gray-900
          border-4 border-gray-900
          shadow-[4px_4px_0px_#1a1a1a]
          hover:shadow-[2px_2px_0px_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5
          active:shadow-none active:translate-x-1 active:translate-y-1
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:shadow-[4px_4px_0px_#1a1a1a] disabled:hover:translate-x-0 disabled:hover:translate-y-0
          transition-all duration-100
        "
      >
        {connect.isPending ? "Connecting…" : "✦ Connect Wallet"}
      </button>
    ) : (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="
          px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wide no-underline
          bg-amber-300 text-gray-900
          border-4 border-gray-900
          shadow-[4px_4px_0px_#1a1a1a]
          hover:shadow-[2px_2px_0px_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5
          transition-all duration-100
        "
      >
        🦊 Install MetaMask
      </a>
    );
  }

  // ── CONNECTED ──────────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Info card */}
      <div
        className="
        flex items-center gap-3 px-4 py-2 rounded-2xl
        bg-white border-4 border-gray-900
        shadow-[4px_4px_0px_#1a1a1a]
      "
      >
        {/* Balance */}
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Balance
          </span>
          <span className="text-sm font-black text-gray-900">
            {formatBalance(4)}
          </span>
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Address */}
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Address
          </span>
          <span className="text-sm font-black font-mono text-gray-900">
            {formatAddress()}
          </span>
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Network selector — ref wraps both button + dropdown */}
        <div className="relative" ref={networkMenuRef}>
          <button
            onClick={() => setShowNetworkMenu((v) => !v)}
            className="
              flex items-center gap-2 px-3 py-1.5 rounded-xl
              bg-gray-100 border-2 border-gray-900
              font-black text-xs uppercase tracking-wide text-gray-900
              hover:bg-amber-100
              shadow-[2px_2px_0px_#1a1a1a]
              hover:shadow-[1px_1px_0px_#1a1a1a] hover:translate-x-px hover:translate-y-px
              transition-all duration-100
            "
          >
            <span
              className="w-2.5 h-2.5 rounded-full border-2 border-gray-900 shrink-0"
              style={{ background: isWrongNetwork ? "#ef4444" : "#22c55e" }}
            />
            <span>
              {CHAIN_EMOJI[chainId] ?? "⛓"}{" "}
              {currentChain?.name ?? `Chain ${chainId}`}
            </span>
            <span className="text-gray-500 text-[10px]">
              {showNetworkMenu ? "▲" : "▼"}
            </span>
          </button>

          {showNetworkMenu && (
            <div
              className="
              absolute top-full right-0 mt-2 z-50
              bg-white border-4 border-gray-900 rounded-2xl
              shadow-[4px_4px_0px_#1a1a1a]
              overflow-hidden min-w-45
            "
            >
              {AVAILABLE_CHAINS.map((chain) => {
                const isActive = chain.id === chainId;
                return (
                  <button
                    key={chain.id}
                    onClick={() => handleNetworkSwitch(chain.id)}
                    disabled={switchChain.isPending}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3
                      font-black text-sm uppercase tracking-wide text-left
                      transition-colors duration-100
                      disabled:opacity-40 disabled:cursor-not-allowed
                      ${
                        isActive
                          ? "bg-amber-300 text-gray-900"
                          : "bg-white text-gray-900 hover:bg-amber-100"
                      }
                    `}
                  >
                    <span className="text-base">
                      {CHAIN_EMOJI[chain.id] ?? "⛓"}
                    </span>
                    <span>{chain.name}</span>
                    {isActive && <span className="ml-auto">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Wrong network */}
      {isWrongNetwork && (
        <button
          onClick={() => handleNetworkSwitch(TARGET_CHAIN_ID)}
          disabled={switchChain.isPending}
          className="
            px-4 py-2 rounded-2xl font-black text-sm uppercase tracking-wide
            bg-red-500 text-white
            border-4 border-gray-900
            shadow-[4px_4px_0px_#1a1a1a]
            hover:shadow-[2px_2px_0px_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-100
          "
        >
          {switchChain.isPending ? "Switching…" : "⚠ Switch to Sepolia"}
        </button>
      )}

      {/* Disconnect */}
      <button
        onClick={() => disconnect.mutate()}
        className="
          px-4 py-2 rounded-2xl font-black text-sm uppercase tracking-wide
          bg-gray-900 text-white
          border-4 border-gray-900
          shadow-[4px_4px_0px_#1a1a1a]
          hover:shadow-[2px_2px_0px_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5
          active:shadow-none active:translate-x-1 active:translate-y-1
          transition-all duration-100
        "
      >
        ✕ Disconnect
      </button>
    </div>
  );
};

export default WalletButton;
