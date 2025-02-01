import { useContext, useEffect } from "react";
import "./App.css";
import { ThemeProvider, ThemeContext } from "./context/theme-provider";
import { Button } from "./components/ui/button";
import Home from "@/Pages/Landing page.tsx/Home1";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartDebate from "./Pages/start-debate/page";
import Debate from "./Pages/Debate/page";
import { LuMoon, LuSun } from "react-icons/lu";
import Navbar from "@/Pages/Landing page.tsx/Navbar";
import InteractiveDemo from "@/Pages/Demo/InteractiveDemo";
import Features from "@/components/ui/Features"
import FAQ from "@/Pages/FAQPage/FAQ";
import HowItWorks from "./Pages/HowItWorks/HowItWorks"
import Footer from "@/Pages/FAQPage/Footer/Footer";



function ThemeToggle() {
  const value = useContext(ThemeContext);
  if (!value) return null;

  return (
    <Button
      onClick={value.toggleTheme}
      className="p-0 h-8 w-8 md:h-12 md:w-12 fixed right-4 bottom-4"
    >
      {value.theme === "dark" ? (
        <LuMoon className="text-xl" />
      ) : (
        <LuSun className="text-xl" />
      )}
    </Button>
  );
}

// Create a HomePage component that combines Home and InteractiveDemo
function HomePage() {
  return (
    <>      <Home />
      
      <InteractiveDemo />
      
      
      <HowItWorks></HowItWorks>
      <Features></Features>
      <FAQ></FAQ>
      <Footer></Footer>
    </>
  );
}

function AppContent() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      <Navbar />
      <div className="relative pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start-debate" element={<StartDebate />} />
          <Route path="/debate" element={<Debate />} />
        </Routes>
      </div>
      <ThemeToggle />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;