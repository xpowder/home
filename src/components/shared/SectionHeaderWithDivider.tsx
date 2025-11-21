import { sectionHeading, sectionParagraph } from "@/utils/fonts";

interface SectionHeaderProps {
  heading: React.ReactNode;
  description: React.ReactNode;
  divider?: boolean;
  align?: "left" | "center" | "right"; // New prop
}

export default function SectionHeaderWithDivider({
  heading,
  description,
  divider = false,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 px-4 pb-8 pt-12 sm:space-y-5 sm:px-0 sm:pt-16`}
      // aria-label={`Section Header for ${heading}`}
    >
      {/* previous style `${poppins.className} font-semibold text-[clamp(24px,6vw,32px)] leading-[120%] sm:leading-[130%] text-center text-[#071621]` */}
      <h2
        className={`${sectionHeading} text-heading text-${align}`}
        aria-label={typeof heading === "string" ? heading : undefined}
      >
        {heading}
      </h2>
      <div className={`${divider ? "block" : "hidden"} bg-primary h-1 w-20 `} />
      {/* previous divider size  h-0.5 w-16 sm:w-20 */}
      <p
        className={`${sectionParagraph} text-subtext text-${align}`}
        // aria-label={typeof description === 'string' ? description : undefined}
      >
        {description}
      </p>
    </div>
  );
}
