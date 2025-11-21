import Link from "next/link";

import { socialLogos } from "@/utils/constants/homeData";

export default function SocialIcons() {
  return (
    <ul className="flex gap-4">
      {socialLogos.map(({ Icon, link }, idx) => (
        <li
          key={idx}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 duration-300 hover:scale-110"
        >
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${link}`}
          >
            <Icon size={20} className="text-white" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
