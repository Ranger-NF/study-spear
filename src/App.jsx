import Footer from "./components/footer";
import Header from "./components/header";
import HeroPage from "./pages/heroPage";

const App = () => {
  return (
    <div className="relative">
      <Header />
      <HeroPage />
      <Footer />
    </div>
  );
};

export default App;
