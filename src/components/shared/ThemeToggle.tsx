"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // This state is to prevent hydration mismatches, ensuring the UI
  // only renders on the client after it knows the current theme.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or disabled button on the server and during hydration

    return (
      <button disabled>
        {" "}
        <Sun className=" h-4 w-4 scale-150 fill-amber-400" />
      </button>
    );
  }
  return (
    <button
      className="flex cursor-pointer items-center justify-center p-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className=" h-4 w-4 rotate-0 scale-150 fill-amber-400 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="text-primary fill-primary absolute  h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-150" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
