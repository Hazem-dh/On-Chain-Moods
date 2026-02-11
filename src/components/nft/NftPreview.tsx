const NftPreview = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div
        className="aspect-square rounded-lg flex items-center justify-center bg-white/90 shadow-xl"
        style={{ border: "3px solid #3B4CCA" }}
      >
        <div className="text-center p-6 md:p-8">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4 text-gray-400">
            ?
          </div>
          <p className="text-sm md:text-base text-gray-600 font-bold">
            Your Mood NFT Preview
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            Select your mood to see the preview
          </p>
        </div>
      </div>

      <button
        className="w-full h-12 md:h-14 px-6 md:px-8 rounded-lg font-bold transition-all duration-200 hover:opacity-90 shadow-lg"
        style={{
          backgroundColor: "#3B4CCA",
          color: "#FFCC00",
          border: "3px solid #FFCC00",
        }}
      >
        Mint Mood NFT
      </button>
    </div>
  );
};

export default NftPreview;
