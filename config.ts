import { http, createConfig } from "wagmi";
import { mainnet, sepolia, anvil } from "wagmi/chains";
import { injected } from "wagmi/connectors";
export const config = createConfig({
  connectors: [injected()],
  chains: [mainnet, sepolia, anvil],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
  ssr: false, // Optional: set to `true` if using server-side rendering
});
