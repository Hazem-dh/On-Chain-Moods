import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Navbar */}
      <NavBar />

      {/* Main Content with Routes */}
      <main className="flex-1"></main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
