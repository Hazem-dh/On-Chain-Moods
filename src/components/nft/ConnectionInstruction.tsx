function ConnectionInstruction() {
  return (
    <div className="p-6 md:p-12 rounded-2xl text-center bg-white border-4 border-gray-900 shadow-[6px_6px_0px_#1a1a1a]">
      <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-4">
        Get Started
      </h2>
      <p className="text-gray-600 mb-4 md:mb-6 text-base md:text-lg">
        Connect your wallet to mint your soulbound Mood NFT and set your
        personal ETH price target.
      </p>

      <div className="space-y-3 md:space-y-4 text-left">
        <div>
          <p className="font-black mb-2 text-sm md:text-base uppercase tracking-wide">
            What you'll need:
          </p>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li className="flex items-center gap-2">
              <span className="text-lg">🦊</span> A Web3 wallet ( MetaMask )
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">🔵</span> Connected to Sepolia testnet
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">⛽</span> Some test ETH for gas fees
            </li>
          </ul>
        </div>

        <div className="p-3 md:p-4 rounded-xl bg-amber-100 border-2 border-gray-900">
          <p className="font-black text-xs md:text-sm text-gray-900">
            ✦Click "Connect Wallet" button above to begin✦
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConnectionInstruction;
