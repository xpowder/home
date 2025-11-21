import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import ServiceDetailsCarosel from "./serviceDetailsCarosel";

// ✅ SVG mocks
jest.mock("@/assets/services/ChevronLeft.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="ChevronLeft" />,
}));
jest.mock("@/assets/services/ChevronRight.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="ChevronRight" />,
}));
jest.mock("@/assets/services/Share.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="Share" />,
}));

// ✅ Next/Image mock (ignores props like fill/priority)
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt?: string }) => (
    <img src={src} alt={alt ?? "mocked-image"} />
  ),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useFormatter: () => (value: any) => value,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ServiceDetailsCarosel", () => {
  const mockImages = ["/test/image1.jpg", "/test/image2.jpg", "/test/image3.jpg"];

  it("renders all slides correctly", () => {
    render(<ServiceDetailsCarosel images={mockImages} />);
    mockImages.forEach((_, index) => {
      const slides = screen.getAllByAltText(`Slide ${index + 1}`);
      expect(slides.length).toBeGreaterThan(0);
    });
  });

  it("changes slides when clicking next and previous buttons", () => {
    render(<ServiceDetailsCarosel images={mockImages} />);
    const next = screen.getByLabelText("Next image");
    const prev = screen.getByLabelText("Previous image");

    fireEvent.click(next);
    fireEvent.click(next);
    fireEvent.click(prev);

    expect(screen.getByAltText("Slide 1")).toBeInTheDocument();
  });

  it("toggles like button state when clicked", () => {
    render(<ServiceDetailsCarosel images={mockImages} />);
    const love = screen.getByLabelText("Love");

    const iconBefore = love.querySelector("svg");
    expect(iconBefore).toHaveClass("text-gray-400");

    fireEvent.click(love);
    const iconAfter = love.querySelector("svg");
    expect(iconAfter).toHaveClass("fill-red-400");

    fireEvent.click(love);
    const iconFinal = love.querySelector("svg");
    expect(iconFinal).toHaveClass("text-gray-400");
  });

  it("handles swipe gestures correctly (mobile touch events)", () => {
    render(<ServiceDetailsCarosel images={mockImages} />);
    const carousel = screen.getByTestId("carousel");

    expect(screen.getByAltText("Slide 1")).toBeInTheDocument();

    // Swipe left → go to next slide (Slide 2)
    fireEvent.touchStart(carousel, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 100 }] });
    expect(screen.getByAltText("Slide 2")).toBeInTheDocument();

    // Swipe right → go back to previous slide (Slide 1)
    fireEvent.touchStart(carousel, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 300 }] });
    expect(screen.getByAltText("Slide 1")).toBeInTheDocument();
  });
});
