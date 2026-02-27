const About = () => {
  return (
    <div className="order-1">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
        Onchain Moods
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
        A soulbound NFT that mirrors your ETH conviction ,its mood updates live
        based on the current ETH price vs your personal target.
      </p>

      <div className="space-y-4 md:space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2">
            Three Live Moods
          </h3>
          <p className="text-sm md:text-base text-gray-700">
            Set your ETH price target when you mint. Your NFT is{" "}
            <span className="font-bold text-green-600">Happy</span> when price
            exceeds it by 10%,{" "}
            <span className="font-bold text-yellow-500">Satisfied</span> when
            it's within 10%, and{" "}
            <span className="font-bold text-blue-500">Sad</span> when it falls
            below.
          </p>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2">
            Powered by Chainlink
          </h3>
          <p className="text-sm md:text-base text-gray-700">
            The mood is computed at query time using a live Chainlink ETH/USD
            price feed , no one updates it manually, it just reflects reality.
          </p>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2">
            Soulbound & Fully On-Chain
          </h3>
          <p className="text-sm md:text-base text-gray-700">
            One NFT per wallet, non-transferable. The SVG artwork, metadata, and
            mood logic all live entirely on the blockchain. You can update your
            price target anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
