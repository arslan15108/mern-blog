import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({children}) => {
    const getInitial = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; 
    }

    const [theme,setTheme] = useState(getInitial);

    useEffect(()=>{
        document.documentElement.classList.remove('light','dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme',theme);
    },[theme])

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{theme,setTheme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}


export default function useTheme() {
    return useContext(ThemeContext);
}