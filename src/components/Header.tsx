import { motion } from "motion/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { getCurrentTheme, toggleDarkTheme } from "../utils/toggleDarkTheme";
import { useState } from "react";

function Header() {
  const [isDark, setIsDark] = useState(getCurrentTheme() === "dark");

  const handleTheme = () => {
    toggleDarkTheme();
    setIsDark(getCurrentTheme() === "dark");
  };
  return (
    <div className="flex h-12 w-full items-center bg-white shadow">
      <h1 className="w-full text-center text-2xl font-semibold">Users CRUD</h1>
      <motion.button
        whileTap={{ scale: 0.8 }}
        className="absolute right-4 rounded p-1 transition-colors duration-300 hover:bg-gray-200"
        onClick={handleTheme}
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <LuSun className="size-6" /> : <LuMoon className="size-6" />}
      </motion.button>
    </div>
  );
}

export default Header;
