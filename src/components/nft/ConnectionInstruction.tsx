function ConnectionInstruction() {
  return (
    <div
      className="p-6 md:p-12 rounded-lg text-center shadow-xl"
      style={{
        backgroundColor: "rgba(255, 204, 0, 0.95)",
        border: "3px solid #3B4CCA",
      }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
        Get Started
      </h2>
      <p className="text-gray-700 mb-4 md:mb-6 text-base md:text-lg">
        Connect your wallet to start minting and managing your mood NFTs on the
        blockchain.
      </p>
      <div className="space-y-3 md:space-y-4">
        <div className="text-left">
          <p className="font-bold mb-2 text-sm md:text-base">
            What you&apos;ll need:
          </p>
          <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
            <li>• A Web3 wallet (MetaMask recommended)</li>
            <li>• Connected to Sepolia testnet</li>
            <li>• Some test ETH for gas fees</li>
          </ul>
        </div>
        <div
          className="p-3 md:p-4 rounded bg-white/50"
          style={{ border: "2px solid #3B4CCA" }}
        >
          <p className="font-bold text-xs md:text-sm">
            Click &quot;Connect Wallet&quot; in the navigation above to begin
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConnectionInstruction;
