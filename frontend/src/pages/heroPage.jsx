import Spline from "@splinetool/react-spline";
import Header from "../components/header";

const HeroPage = () => {
  return (
    <div className="relative">
      <Header />
      <div className="min-h-screen mx-4 md:m-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-stretch">
            <div className="max-w-7/12 ">
              <h1>Intelligent Learning Optimized for You</h1>
              <p>
                Welcome to the next evolution in digital intelligence.
                Autonomous systems now interpret intent, model complexity, and
                generate results with algorithmic precision. As cloud-native
                architecture converges with machine-aware design, user-centric
                solutions emerge—driven not by code, but cognition. From edge
                inference to semantic mapping, every layer is fine-tuned by
                data-driven insight. Let your platform scale in parallel with
                purpose, guided by modular thinking and AI-enhanced flow
                structures.
              </p>
            </div>
            <Spline
              className=" h-72"
              scene="https://prod.spline.design/SNyusfhSZ9utKdNf/scene.splinecode"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
