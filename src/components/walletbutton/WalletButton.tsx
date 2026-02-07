import { useState } from "react";
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
import { sepolia, baseSepolia } from "wagmi/chains";
import { formatUnits } from "viem";

const TARGET_CHAIN_ID = sepolia.id;
const AVAILABLE_CHAINS = [sepolia, baseSepolia];

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

  const hasWallet = typeof window !== "undefined" && "ethereum" in window;

  const connector = connectors[0];

  const currentChain = chains.find((chain) => chain.id === chainId);
  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  // THIS IS THE FUNCTION - Make sure it's here
  const handleNetworkSwitch = (targetChainId: number) => {
    switchChain.mutate({ chainId: targetChainId });
    setShowNetworkMenu(false);
  };

  const formatBalance = (decimals: number = 4) =>
    balance
      ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(decimals)} ${balance.symbol}`
      : `${"0.".padEnd(decimals + 2, "0")} ETH`;

  const formatAddress = () =>
    ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  if (!isConnected) {
    return (
      <div className="flex items-center gap-3">
        {hasWallet ? (
          <button
            onClick={() => connect.mutate({ connector })}
            disabled={connect.isPending}
            className="h-12 px-8 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: connect.isPending ? "#6B7280" : "#FFCC00",
              color: connect.isPending ? "#FFF" : "#000",
              border: "3px solid #3B4CCA",
            }}
          >
            {connect.isPending ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-8 rounded-lg font-bold transition-all duration-200 flex items-center justify-center no-underline"
            style={{
              backgroundColor: "#FFCC00",
              color: "#000",
              border: "3px solid #3B4CCA",
            }}
          >
            Install MetaMask
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Desktop View */}
      <div className="hidden md:flex items-center gap-3">
        <div
          className="flex items-center gap-4 px-6 h-12 rounded-lg"
          style={{
            backgroundColor: "#FFCC00",
            border: "3px solid #3B4CCA",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">Balance:</span>
            <span className="text-sm font-bold text-black">
              {formatBalance(4)}
            </span>
          </div>

          <div className="w-px h-6" style={{ backgroundColor: "#3B4CCA" }} />

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">Address:</span>
            <span className="text-sm font-mono font-bold text-black">
              {formatAddress()}
            </span>
          </div>

          <div className="w-px h-6" style={{ backgroundColor: "#3B4CCA" }} />

          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              onBlur={() => setTimeout(() => setShowNetworkMenu(false), 200)}
              className="text-sm flex items-center gap-2 font-bold text-black hover:text-gray-700 transition-colors"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: isWrongNetwork ? "#FF0000" : "#00CC00",
                }}
              />
              <span className="whitespace-nowrap">
                {currentChain?.name || `Chain ${chainId}`}
              </span>
              <span className="text-xs">▼</span>
            </button>

            {showNetworkMenu && (
              <div
                className="absolute top-full right-0 mt-2 rounded-lg shadow-xl min-w-[220px] overflow-hidden z-50"
                style={{
                  backgroundColor: "#FFCC00",
                  border: "3px solid #3B4CCA",
                }}
              >
                {AVAILABLE_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleNetworkSwitch(chain.id)}
                    disabled={switchChain.isPending}
                    className="w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        chain.id === chainId ? "#3B4CCA" : "transparent",
                      color: chain.id === chainId ? "#FFCC00" : "#000",
                    }}
                    onMouseEnter={(e) => {
                      if (!switchChain.isPending && chain.id !== chainId) {
                        e.currentTarget.style.backgroundColor = "#F0E68C";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (chain.id !== chainId) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          chain.id === chainId ? "#FFCC00" : "#9CA3AF",
                      }}
                    />
                    {chain.name}
                    {chain.id === chainId && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isWrongNetwork && (
          <button
            onClick={() => handleNetworkSwitch(TARGET_CHAIN_ID)}
            disabled={switchChain.isPending}
            className="h-12 px-6 rounded-lg font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            style={{
              backgroundColor: "#FF0000",
              border: "3px solid #3B4CCA",
            }}
          >
            {switchChain.isPending ? "Switching..." : "Switch to Sepolia"}
          </button>
        )}

        <button
          onClick={() => disconnect.mutate()}
          className="h-12 px-6 rounded-lg font-bold transition-all duration-200"
          style={{
            backgroundColor: "#3B4CCA",
            color: "#FFCC00",
            border: "3px solid #FFCC00",
          }}
        >
          Disconnect
        </button>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden items-stretch gap-2 w-full">
        <div
          className="flex flex-col justify-center gap-2 px-4 py-3 rounded-lg flex-1 min-w-0"
          style={{
            backgroundColor: "#FFCC00",
            border: "3px solid #3B4CCA",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Balance:</span>
            <span className="text-xs font-bold text-black">
              {formatBalance(3)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700">ID:</span>
            <span className="text-xs font-mono font-bold text-black">
              {formatAddress()}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              onBlur={() => setTimeout(() => setShowNetworkMenu(false), 200)}
              className="text-xs flex items-center gap-2 font-bold text-black"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isWrongNetwork ? "#FF0000" : "#00CC00",
                }}
              />
              <span className="truncate">
                {currentChain?.name || `Chain ${chainId}`}
              </span>
              <span className="text-xs ml-auto">▼</span>
            </button>

            {showNetworkMenu && (
              <div
                className="absolute top-full left-0 mt-2 rounded-lg shadow-xl w-full min-w-[200px] overflow-hidden z-50"
                style={{
                  backgroundColor: "#FFCC00",
                  border: "3px solid #3B4CCA",
                }}
              >
                {AVAILABLE_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleNetworkSwitch(chain.id)}
                    disabled={switchChain.isPending}
                    className="w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        chain.id === chainId ? "#3B4CCA" : "transparent",
                      color: chain.id === chainId ? "#FFCC00" : "#000",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          chain.id === chainId ? "#FFCC00" : "#9CA3AF",
                      }}
                    />
                    {chain.name}
                    {chain.id === chainId && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isWrongNetwork ? (
            <button
              onClick={() => handleNetworkSwitch(TARGET_CHAIN_ID)}
              disabled={switchChain.isPending}
              className="px-3 py-2 rounded-lg font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs whitespace-nowrap h-full flex items-center justify-center"
              style={{
                backgroundColor: "#FF0000",
                border: "3px solid #3B4CCA",
              }}
            >
              {switchChain.isPending ? "..." : "Switch"}
            </button>
          ) : (
            <button
              onClick={() => disconnect.mutate()}
              className="px-3 py-2 rounded-lg font-bold transition-all duration-200 text-xs h-full"
              style={{
                backgroundColor: "#3B4CCA",
                color: "#FFCC00",
                border: "3px solid #FFCC00",
              }}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletButton;
