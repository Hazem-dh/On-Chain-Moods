import { useState } from "react";
import { useReadContract } from "wagmi";
import {
  PriceFeedAddress,
  PriceFeedAbi,
} from "../../Smart contracts/PriceFeed";

// ── Types ────────────────────────────────────────────────────────────────────
type Mood = "HAPPY" | "SATISFIED" | "SAD";
type MintStep = "idle" | "signing" | "pending" | "done";

interface NftData {
  mood: Mood;
  threshold: number;
  currentPrice: number;
  tokenId: number;
  svgUri: string;
}

// ── Mock SVGs ─────────────────────────────────────────────────────────────────
const MOCK_SVGS: Record<Mood, string> = {
  HAPPY: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' fill='%23d1fae5' rx='20'/>
    <circle cx='100' cy='90' r='55' fill='%23fbbf24' stroke='%231a1a1a' stroke-width='4'/>
    <circle cx='82' cy='78' r='7' fill='%231a1a1a'/>
    <circle cx='118' cy='78' r='7' fill='%231a1a1a'/>
    <circle cx='84' cy='75' r='2.5' fill='white'/>
    <circle cx='120' cy='75' r='2.5' fill='white'/>
    <path d='M78 105 Q100 128 122 105' stroke='%231a1a1a' stroke-width='4' fill='none' stroke-linecap='round'/>
    <path d='M75 60 Q82 50 89 60' stroke='%231a1a1a' stroke-width='3' fill='none' stroke-linecap='round'/>
    <path d='M111 60 Q118 50 125 60' stroke='%231a1a1a' stroke-width='3' fill='none' stroke-linecap='round'/>
    <text x='100' y='175' text-anchor='middle' font-size='13' font-weight='900' fill='%231a1a1a' font-family='sans-serif'>HAPPY</text>
  </svg>`,
  SATISFIED: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' fill='%23fef3c7' rx='20'/>
    <circle cx='100' cy='90' r='55' fill='%23fbbf24' stroke='%231a1a1a' stroke-width='4'/>
    <circle cx='82' cy='80' r='7' fill='%231a1a1a'/>
    <circle cx='118' cy='80' r='7' fill='%231a1a1a'/>
    <circle cx='84' cy='77' r='2.5' fill='white'/>
    <circle cx='120' cy='77' r='2.5' fill='white'/>
    <path d='M80 108 Q100 118 120 108' stroke='%231a1a1a' stroke-width='4' fill='none' stroke-linecap='round'/>
    <text x='100' y='175' text-anchor='middle' font-size='13' font-weight='900' fill='%231a1a1a' font-family='sans-serif'>SATISFIED</text>
  </svg>`,
  SAD: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' fill='%23dbeafe' rx='20'/>
    <circle cx='100' cy='90' r='55' fill='%23fbbf24' stroke='%231a1a1a' stroke-width='4'/>
    <circle cx='82' cy='82' r='7' fill='%231a1a1a'/>
    <circle cx='118' cy='82' r='7' fill='%231a1a1a'/>
    <circle cx='84' cy='79' r='2.5' fill='white'/>
    <circle cx='120' cy='79' r='2.5' fill='white'/>
    <path d='M80 116 Q100 104 120 116' stroke='%231a1a1a' stroke-width='4' fill='none' stroke-linecap='round'/>
    <path d='M78 72 Q85 64 92 72' stroke='%231a1a1a' stroke-width='3' fill='none' stroke-linecap='round'/>
    <path d='M108 72 Q115 64 122 72' stroke='%231a1a1a' stroke-width='3' fill='none' stroke-linecap='round'/>
    <ellipse cx='84' cy='112' rx='5' ry='7' fill='%2393c5fd' opacity='0.7'/>
    <ellipse cx='116' cy='114' rx='5' ry='7' fill='%2393c5fd' opacity='0.7'/>
    <text x='100' y='175' text-anchor='middle' font-size='13' font-weight='900' fill='%231a1a1a' font-family='sans-serif'>SAD</text>
  </svg>`,
};

const MOODS: Mood[] = ["HAPPY", "SATISFIED", "SAD"];
const randomMood = (): Mood => MOODS[Math.floor(Math.random() * MOODS.length)];

// ── Mock data toggles ─────────────────────────────────────────────────────────
const MOCK_NFT: NftData | null = null;
// const MOCK_NFT: NftData = {
//   mood: "HAPPY", threshold: 3000, currentPrice: 3400, tokenId: 42,
//   svgUri: MOCK_SVGS["HAPPY"],
// };
const MOCK_IS_LOADING = false;

// ── Mood config ───────────────────────────────────────────────────────────────
const MOOD_CONFIG: Record<
  Mood,
  { label: string; bg: string; text: string; border: string }
> = {
  HAPPY: {
    label: "Happy",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  SATISFIED: {
    label: "Satisfied",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  SAD: {
    label: "Sad",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
};

// ── Shared stat card ──────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div
    className={`p-3 rounded-xl border-2 border-gray-900 shadow-[3px_3px_0_#1a1a1a] ${accent ? "bg-amber-50" : "bg-white"}`}
  >
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {label}
    </p>
    <p className="font-black text-gray-900 text-base">{value}</p>
  </div>
);

// ── Price feed hook ───────────────────────────────────────────────────────────
const useEthPrice = () => {
  const { data, isLoading, isError } = useReadContract({
    address: PriceFeedAddress,
    abi: PriceFeedAbi,
    functionName: "latestRoundData",
  });

  // latestRoundData returns [roundId, answer, startedAt, updatedAt, answeredInRound]
  // answer has 8 decimals
  const rawPrice = data
    ? (data as [bigint, bigint, bigint, bigint, bigint])[1]
    : null;
  const price = rawPrice ? Number(rawPrice) / 1e8 : null;

  return { price, isLoading, isError };
};

// ── Loading ───────────────────────────────────────────────────────────────────
const LoadingCard = () => (
  <div className="rounded-2xl bg-white border-4 border-gray-900 shadow-[6px_6px_0_#1a1a1a] p-10 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="text-5xl animate-bounce">🔍</div>
      <p className="font-black text-gray-700 uppercase tracking-wide text-sm">
        Checking wallet…
      </p>
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-gray-900 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ── NFT Card (owns token) ─────────────────────────────────────────────────────
const NftCard = ({ nft }: { nft: NftData }) => {
  const mood = MOOD_CONFIG[nft.mood];
  const [updating, setUpdating] = useState(false);
  const [newThreshold, setNewThreshold] = useState("");

  const handleUpdate = () => {
    if (!newThreshold || Number(newThreshold) <= 0) return;
    // TODO: useWriteContract → updateThreshold(BigInt(Number(newThreshold) * 1e8))
    console.log("updateThreshold mock:", Number(newThreshold) * 1e8);
    setUpdating(false);
    setNewThreshold("");
  };

  return (
    <div className="space-y-4">
      {/* SVG */}
      <div className="aspect-square rounded-2xl border-4 border-gray-900 shadow-[6px_6px_0_#1a1a1a] overflow-hidden">
        <img
          src={nft.svgUri}
          alt={`Mood NFT — ${nft.mood}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mood badge + token id */}
      <div className="flex items-center justify-between">
        <span
          className={`px-4 py-1 rounded-xl border-2 border-gray-900 font-black uppercase tracking-widest text-sm ${mood.bg} ${mood.text}`}
        >
          {mood.label}
        </span>
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">
          Token #{nft.tokenId}
        </span>
      </div>

      {/* Stats — no vs Target */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="ETH Now"
          value={`$${nft.currentPrice.toLocaleString()}`}
          accent
        />
        <StatCard
          label="Your Target"
          value={`$${nft.threshold.toLocaleString()}`}
        />
      </div>

      {/* Update threshold */}
      {updating ? (
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 rounded-2xl bg-white border-4 border-gray-900 shadow-[4px_4px_0_#1a1a1a]">
            <span className="font-black text-gray-400">$</span>
            <input
              type="number"
              placeholder="New target…"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              className="w-full py-2.5 font-black text-gray-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-2xl font-black text-sm uppercase tracking-wide bg-amber-400 text-gray-900 border-4 border-gray-900 shadow-[4px_4px_0_#1a1a1a] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100"
          >
            Save
          </button>
          <button
            onClick={() => {
              setUpdating(false);
              setNewThreshold("");
            }}
            className="px-4 py-2 rounded-2xl font-black text-sm bg-white text-gray-900 border-4 border-gray-900 shadow-[4px_4px_0_#1a1a1a] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setUpdating(true)}
          className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wide bg-white text-gray-900 border-4 border-gray-900 shadow-[4px_4px_0_#1a1a1a] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-100"
        >
          ✎ Update Price Target
        </button>
      )}
    </div>
  );
};

// ── Mint Card (no token yet) ──────────────────────────────────────────────────
const MintCard = ({ currentPrice }: { currentPrice: number | null }) => {
  const [threshold, setThreshold] = useState("");
  const [step, setStep] = useState<MintStep>("idle");
  const [mintedNft, setMintedNft] = useState<NftData | null>(null);

  const handleMint = () => {
    if (!threshold || Number(threshold) <= 0) return;
    setStep("signing");
    setTimeout(() => {
      setStep("pending");
      setTimeout(() => {
        const mood = randomMood();
        setMintedNft({
          mood,
          threshold: Number(threshold),
          currentPrice: currentPrice ?? 0,
          tokenId: Math.floor(Math.random() * 1000),
          svgUri: MOCK_SVGS[mood],
        });
        setStep("done");
        // TODO: useWriteContract → mint(BigInt(Number(threshold) * 1e8))
      }, 2000);
    }, 1200);
  };

  if (step === "done" && mintedNft) return <NftCard nft={mintedNft} />;

  const isBusy = step === "signing" || step === "pending";

  return (
    <div className="space-y-4">
      {/* Live ETH price card */}
      <div className="rounded-2xl bg-white border-4 border-gray-900 shadow-[6px_6px_0_#1a1a1a] p-6 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Live ETH Price
        </p>

        {currentPrice !== null ? (
          <p className="text-5xl font-black text-gray-900">
            $
            {currentPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-base font-bold text-gray-400 ml-2">USD</span>
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 border border-gray-900 animate-bounce" />
            <div
              className="w-2 h-2 rounded-full bg-amber-400 border border-gray-900 animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-amber-400 border border-gray-900 animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        )}

        <div className="h-px bg-gray-100" />

        <p className="text-xs font-bold text-gray-500 leading-relaxed">
          Set a future target price — your NFT mood will reflect whether ETH has
          reached your goal.
        </p>

        {/* Tx status */}
        {isBusy && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border-2 border-gray-900">
            <span
              className={`text-2xl ${step === "signing" ? "animate-pulse" : "animate-spin"}`}
            >
              {step === "signing" ? "✍️" : "⏳"}
            </span>
            <div>
              <p className="font-black text-sm text-gray-900 uppercase tracking-wide">
                {step === "signing"
                  ? "Waiting for signature…"
                  : "Transaction pending…"}
              </p>
              <p className="text-xs text-gray-400 font-bold">
                {step === "signing"
                  ? "Confirm in your wallet"
                  : "Hang tight, this takes a moment"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 rounded-2xl bg-white border-4 border-gray-900 shadow-[4px_4px_0_#1a1a1a]">
        <span className="font-black text-gray-400 text-lg flex-shrink-0">
          $
        </span>
        <input
          type="number"
          min="1"
          placeholder="Your ETH target, e.g. 4000"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          disabled={isBusy}
          className="w-full py-3 font-black text-gray-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-gray-400 disabled:opacity-40"
        />
      </div>

      {/* Mint button */}
      <button
        onClick={handleMint}
        disabled={!threshold || Number(threshold) <= 0 || isBusy}
        className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wide bg-amber-400 text-gray-900 border-4 border-gray-900 shadow-[4px_4px_0_#1a1a1a] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0_#1a1a1a] disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all duration-100"
      >
        {isBusy ? "…" : "✦ Mint My Mood NFT"}
      </button>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const NftPreview = () => {
  const { price, isLoading: priceLoading } = useEthPrice();

  if (MOCK_IS_LOADING) return <LoadingCard />;
  if (MOCK_NFT) return <NftCard nft={MOCK_NFT} />;
  return <MintCard currentPrice={priceLoading ? null : price} />;
};

export default NftPreview;
