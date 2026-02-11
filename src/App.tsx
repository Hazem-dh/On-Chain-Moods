import { useConnection } from "wagmi";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Background from "./components/layout/Background";
import About from "./components/nft/About";
import ConnectionInstruction from "./components/nft/ConnectionInstruction";
import NftPreview from "./components/nft/NftPreview";

function App() {
  const { isConnected } = useConnection();

  return (
    <div className="min-h-screen flex flex-col text-gray-900 relative overflow-hidden bg-transparent">
      <Background />
      <NavBar />
      <main className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-4 py-8 md:py-12 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <About />
              <div className="order-2">
                {isConnected ? <NftPreview /> : <ConnectionInstruction />}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
