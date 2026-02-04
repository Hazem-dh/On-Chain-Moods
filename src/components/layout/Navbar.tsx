//import kilnLogo from "../../assets/kiln-logo.png";
import WalletButton from "../walletbutton/WalletButton";

const NavBar = () => {
  return (
    <nav>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-2 sm:py-5 flex items-center justify-between">
        <img alt=" Logo" className="h-12 sm:h-16 object-contain" />
        <WalletButton />
      </div>
    </nav>
  );
};

export default NavBar;
