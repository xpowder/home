import React from "react";

interface LogButtonProps {
  text: string;
  isSubmitting: boolean;
  type?: "button" | "submit" | "reset"; // ✅ fixed
}

export default function LogButton({ text, isSubmitting, type }: LogButtonProps) {
  return (
    <button
      disabled={isSubmitting}
      type={type}
      aria-busy={isSubmitting} // announces to screen readers that the button is busy
      aria-disabled={isSubmitting} // indicates disabled state
      aria-label={isSubmitting ? `${text} (loading)` : text} // readable label for assistive tech
      className="bg-primaryDark hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled h-12 w-full cursor-pointer rounded-lg text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
    >
      {text}
    </button>
  );
}
