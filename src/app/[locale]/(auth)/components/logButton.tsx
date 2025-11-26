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
      className="bg-primary hover:bg-primaryDark active:bg-primaryDark focus:bg-primary focus:ring-primary disabled:bg-gray-300 h-12 w-full cursor-pointer rounded-lg text-white font-medium duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
    >
      {text}
    </button>
  );
}
