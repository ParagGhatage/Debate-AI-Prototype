import React, { useEffect, useState } from "react";

// Explicitly define ThemeOptions as string-based enum
enum ThemeOptions {
    Light = "light",
    Dark = "dark"
}

interface ThemeContextStructure {
    theme: ThemeOptions;
    toggleTheme: () => void;
}

const defaultThemeContext: ThemeContextStructure = {
    theme: ThemeOptions.Light,
    toggleTheme: () => {}
};

export const ThemeContext = React.createContext<ThemeContextStructure>(defaultThemeContext);

// Validate if a value is a valid ThemeOptions enum
function validateThemeCode(themeCode: string): themeCode is ThemeOptions {
    return Object.values(ThemeOptions).includes(themeCode as ThemeOptions);
}

function getInitialTheme(): ThemeOptions {
    const storedTheme = localStorage.getItem("Theme");

    if (storedTheme && validateThemeCode(storedTheme)) {
        return storedTheme as ThemeOptions;
    }

    // Determine system preference
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? ThemeOptions.Light : ThemeOptions.Dark;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeOptions>(getInitialTheme());

    useEffect(() => {
        document.body.classList.toggle("dark", theme === ThemeOptions.Dark);
        localStorage.setItem("Theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((prevTheme) => (prevTheme === ThemeOptions.Dark ? ThemeOptions.Light : ThemeOptions.Dark));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
