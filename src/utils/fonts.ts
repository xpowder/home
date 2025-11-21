import { Inter, Outfit, Poppins, Roboto } from "next/font/google"; //Importing fonts

//Configure fonts and exporting to use thought out the app
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap", // 👈 Important: no render block
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-inter",
  preload: false, // 👈 not critical, load later
});
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
  preload: false, // 👈 not critical, load later
});
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"], // choose the weights you need
  variable: "--font-outfit",
  preload: false, // 👈 not critical, load later
});

// Optional: reusable typography classes

//heading
//initial
// export const heroHeading=`${poppins.className} font-bold text-[max(2.5vw,24px)]  leading-[min(48px, 2vw)] w-full`
//export const sectionHeading= ${poppins.className} font-semibold text-[clamp(24px,6vw,24px)] leading-[120%] sm:leading-[130%]

//latest
export const heroHeading = `${poppins.className} font-bold text-[clamp(24px,2.5vw,40px)] leading-[clamp(32px,3vw,48px)] w-full`;
export const sectionHeading = `${poppins.className} font-semibold text-[clamp(20px,2vw,32px)] leading-[clamp(28px,2.5vw,40px)] w-full`;
export const cardHeading = `${poppins.className} font-semibold text-[clamp(16px,1.5vw,20px)] leading-[clamp(24px,2vw,28px)]`;

//paragraph

//initals
// export const heroParagraph=`${roboto.className} font-normal text-[max(1.3vw,14px)]  leading-[min(28px, 1vw)]  w-full`
//export const sectionParagraph =`${roboto.className} text-[clamp(14px,4vw,16px)] leading-[150%] sm:leading-[160%] text-center text-[#4B4B4B]`

//latest
export const heroParagraph = `${roboto.className} font-normal text-[clamp(12px,1vw,16px)] leading-[clamp(20px,2vw,28px)] w-full`;
export const sectionParagraph = `${roboto.className} font-normal text-[clamp(14px,1.5vw,16px)] leading-[clamp(20px,2.5vw,24px)] w-full text-center`;
export const cardParagraph = `${roboto.className} font-normal text-[clamp(12px,1.2vw,14px)] leading-[clamp(16px,1.8vw,20px)] w-full`;

//just for ref.
export const heading = `${poppins.className} font-bold text-[28px] leading-[24px]`;
export const paragraph = `${poppins.className} font-normal text-[16px] leading-[24px]`;
