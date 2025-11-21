import Link from "next/link";
import { useTranslations } from "next-intl";

import { navLinks } from "@/utils/constants/homeData";

export function NavLinks({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("nav");
  return (
    <ul className="flex w-full flex-col items-start space-y-4 px-8 xl:flex-row xl:items-center xl:space-x-5 xl:space-y-0">
      {navLinks.map((item, idx) => (
        <li key={idx} className="group relative w-full xl:w-auto">
          <Link
            href={item.link}
            onClick={onClick}
            aria-label={`Navigate to ${t(item.name.toLowerCase())}`}
            className="text-heading group-hover:text-primary text-[clamp(15px,16px,17px)] transition"
          >
            {t(item.name.toLowerCase())}
          </Link>
          <span className="h-.5 bg-primary absolute -bottom-1 left-0 hidden w-0 transition-all duration-300 group-hover:w-full xl:block" />
          <div className="bg-foreground/20 mt-2 block h-px w-full xl:hidden" />
        </li>
      ))}
    </ul>
  );
}
