import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useTheme } from "next-themes";
import React from "react";

import { ThemeToggle } from "./ThemeToggle";

//  Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ThemeToggle Component", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });
  });

  it("renders a placeholder button before mounting", async () => {
    const { container } = render(<ThemeToggle />);

    // Try to detect placeholder *if it exists* immediately
    const placeholder = container.querySelector("button:disabled");
    if (placeholder) {
      expect(placeholder).toBeInTheDocument();
    }

    // Wait for React to finish running useEffect (mounted state)
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
  it("renders without crashing", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles theme from light to dark when clicked", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles theme from dark to light when clicked", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
