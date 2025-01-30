// App.tsx
import { useContext, useEffect } from 'react';
import './App.css';
import { ThemeProvider, ThemeContext } from './context/theme-provider';
import { Button } from './components/ui/button';
import Home from './Pages/Landing page.tsx/Home1';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartDebate from './Pages/start-debate/page';
import Debate from './Pages/Debate/page';  // Import the Debate page
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";

// Theme toggle button
function Subscriber() {
  const value = useContext(ThemeContext);
  return (
    <Button onClick={value!.toggleTheme} className='p-0 h-8 w-8 md:h-12 md:w-12 fixed right-4 bottom-4'>
      {value?.theme ? <LuMoon className='text-xl' /> : <LuSun className="text-xl" />}
    </Button>
  );
}

function App() {
  const { theme } = useContext(ThemeContext);

  // Apply dark class to the body when dark mode is enabled
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeProvider>
      <Router>
        {/* Routes for your pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start-debate" element={<StartDebate />} />
          <Route path="/debate" element={<Debate />} />  {/* Add the route for Debate page */}
        </Routes>

        {/* Theme toggle button */}
        <Subscriber />
      </Router>
    </ThemeProvider>
  );
}

export default App;
