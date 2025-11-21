import Image from "next/image";
import React from "react";

import Image1 from "@/assets/providerDashboard/i1.png";
import Image2 from "@/assets/providerDashboard/i2.png";
import Image3 from "@/assets/providerDashboard/i3.png";
import { cardHeading } from "@/utils/fonts";

const data = [
  {
    img: Image1,
    name: "Sarah Alami",
    message: "I need help with electrical wiring in my kitchen",
    lastMessaged: "2h",
  },
  {
    img: Image2,
    name: "Sarah Alami",
    message:
      "I need help with electrical wiring in my kitchen I need help with electrical wiring in my kitchen",
    lastMessaged: "2h",
  },
  {
    img: Image3,
    name: "Sarah Alami",
    message: "I need help with electrical wiring in my kitchen",
    lastMessaged: "2h",
  },
];

export default function RecentMessages() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className={`${cardHeading} text-[#111827]`}>Portfolio & Credentials</h2>
        <button
          aria-label="Go to Messages"
          className={`font-roboto text-primaryDark font-medium duration-300`}
        >
          Go to Messages
        </button>
      </div>
      <div aria-label="Recent messages" className="border-1 rounded-xl border-gray-200">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center justify-start gap-3">
                <Image
                  src={item.img}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                />
                <div className="">
                  <h2 className="font-roboto text-[16px] font-medium text-[#111827]">
                    {item.name}
                  </h2>
                  <p className="font-roboto w-[150px] truncate whitespace-nowrap text-[14px] font-normal text-[#4B5563] sm:w-[300px]">
                    {item.message}
                  </p>
                </div>
              </div>
              <div className="font-roboto text-[14px] font-normal text-[#6B7280]">
                {item.lastMessaged}
              </div>
            </div>
            {/* Divider */}
            {idx !== data.length - 1 && <div className="h-[1px] w-full bg-gray-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}
