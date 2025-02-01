import { useContext, useEffect } from 'react';
import './App.css';
import { ThemeProvider, ThemeContext } from './context/theme-provider';
import { Button } from './components/ui/button';
import Home from './Pages/Landing page.tsx/Home1';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartDebate from './Pages/start-debate/page';
import Debate from './Pages/Debate/page';  
import { LuMoon, LuSun } from "react-icons/lu";

// Theme toggle button
function Subscriber() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button onClick={toggleTheme} className='p-0 h-8 w-8 md:h-12 md:w-12 fixed right-4 bottom-4'>
      {theme === "dark" ? <LuMoon className='text-xl' /> : <LuSun className="text-xl" />}
    </Button>
  );
}

function App() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start-debate" element={<StartDebate />} />
          <Route path="/debate" element={<Debate />} />  
        </Routes>

        <Subscriber />
      </Router>
    </ThemeProvider>
  );
}

export default App;
