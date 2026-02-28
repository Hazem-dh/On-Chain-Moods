import { useConnection } from "wagmi";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import About from "./components/nft/About";
import ConnectionInstruction from "./components/nft/ConnectionInstruction";
import Nft from "./components/nft/Nft";
import FloatingStar from "./components/layout/FloatingStar";
import { STARS } from "./constants/constants";

function App() {
  const { isConnected } = useConnection();

  return (
    <div className="min-h-screen flex flex-col text-gray-900 relative overflow-hidden">
      {/*  Background  */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(to bottom, #bfdbfe 0%, #ffffff 100%)",
        }}
      />

      {/* Floating ✦ stars drifting upward */}
      {STARS.map((s, i) => (
        <FloatingStar key={i} {...s} />
      ))}

      {/* Dashes  */}
      <div
        className="fixed inset-x-3 top-3 z-0 pointer-events-none rounded-3xl border-4 border-gray-900 border-dashed opacity-[0.07]"
        style={{ bottom: "76px" }}
      />

      <NavBar />

      <main className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-4 py-8 md:py-12 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <About />
              <div className="order-2">
                {isConnected ? <Nft /> : <ConnectionInstruction />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
