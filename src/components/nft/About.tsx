const About = () => {
  return (
    <div className="order-1">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
        Onchain Moods
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
        Express your emotions on the blockchain with dynamic NFTs that reflect
        how you feel.
      </p>

      <div className="space-y-4 md:space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2">
            Five Mood States
          </h3>
          <p className="text-sm md:text-base text-gray-700">
            Choose from five distinct moods: Happy, Sad, Angry, Sleepy, and
            Surprised. Each state generates unique SVG artwork.
          </p>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2">Dynamic Updates</h3>
          <p className="text-sm md:text-base text-gray-700">
            Update your mood NFTs as your feelings change throughout the day.
            Your NFT evolves with you.
          </p>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2">Fully On-Chain</h3>
          <p className="text-sm md:text-base text-gray-700">
            Everything is stored directly on the blockchain. The SVG artwork,
            metadata, and all data are permanently on-chain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
