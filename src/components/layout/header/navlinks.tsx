import Link from "next/link";
import { useTranslations } from "next-intl";

import { navLinks } from "@/utils/constants/homeData";

export function NavLinks({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("nav");
  return (
    <ul className="flex w-full flex-col items-stretch space-y-1 px-4 py-2 xl:flex-row xl:items-center xl:space-x-6 xl:space-y-0 xl:px-0 xl:py-0">
      {navLinks.map((item, idx) => (
        <li key={idx} className="group relative w-full xl:w-auto">
          <Link
            href={item.link}
            onClick={onClick}
            aria-label={`Navigate to ${t(item.name.toLowerCase())}`}
            className="text-heading group-hover:text-primary block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base font-medium transition-colors xl:px-0 xl:py-0 xl:rounded-none xl:hover:bg-transparent"
          >
            {t(item.name.toLowerCase())}
          </Link>
          <span className="h-0.5 bg-primary absolute -bottom-1 left-0 hidden w-0 transition-all duration-300 group-hover:w-full xl:block" />
          <div className="bg-gray-200 dark:bg-gray-700 mt-1 block h-px w-full xl:hidden" />
        </li>
      ))}
    </ul>
  );
}
