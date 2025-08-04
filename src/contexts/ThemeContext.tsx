import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorTheme =
    | "default"
    | "blue"
    | "green"
    | "purple"
    | "red"
    | "orange"
    | "pink"
    | "indigo"
    | "teal"
    | "slate"
    | "emerald"
    | "violet"
    | "dark-blue"
    | "dark-slate"
    | "dark-green";

interface ThemeContextType {
    colorTheme: ColorTheme;
    setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [colorTheme, setColorTheme] = useState<ColorTheme>("default");

    useEffect(() => {
        const savedTheme = localStorage.getItem("color-theme") as ColorTheme;
        if (savedTheme) {
            setColorTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("color-theme", colorTheme);
        document.documentElement.setAttribute("data-color-theme", colorTheme);
    }, [colorTheme]);

    return (
        <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
