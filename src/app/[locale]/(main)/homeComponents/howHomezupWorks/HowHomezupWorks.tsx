import { howHomezupWorksData } from "@/utils/constants/homeData";
import { cardHeading, cardParagraph, sectionHeading } from "@/utils/fonts";

export default function HowHomezupWorks() {
  return (
    <section role="region" aria-label="How Homezup Works Section" className="">
      <div className="container p-5 py-20">
        {/* Main section heading */}
        <h2
          id="how-homezup-works-heading"
          // prev style ${poppins.className} font-semibold text-[clamp(24px,6vw,32px)] leading-[120%] sm:leading-[130%] text-center text-[#071621]`
          className={`${sectionHeading} text-heading text-center`}
        >
          How Homezup Works
        </h2>

        <div
          className="relative mt-5 flex flex-col items-center justify-center gap-10 md:flex-row"
          role="list"
          aria-label="Steps showing how the Homezup platform works"
        >
          <div className="bg-primary top-4.5 absolute z-0 mx-auto hidden h-1 w-[68%] md:block" />

          {howHomezupWorksData.map((item) => (
            <div
              key={item.id}
              role="listitem"
              aria-label={`Step ${item.id}: ${item.heading}`}
              className="flex h-full w-full flex-col items-center justify-center text-center"
            >
              <span
                className="bg-primary text-bold z-10 mb-2 flex h-10 w-10 items-center justify-center rounded-full text-white"
                aria-hidden="true"
              >
                {item.id}
              </span>
              <h3
                // pev style `${poppins.className} font-semibold max-w-[300px] text-[20px] leading-[130%] text-heading`
                className={`${cardHeading}  text-heading`}
              >
                {item.heading}
              </h3>
              <p
                // prev style `${roboto.className} font-normal max-w-[300px] text-[14px] leading-[160%] text-heading mt-4`
                className={`${cardParagraph} text-subtext`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
