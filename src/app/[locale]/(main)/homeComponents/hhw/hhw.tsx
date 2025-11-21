"use client";
import Image from "next/image";

import HHMImage from "@/assets/home/hhw/hhwImage.png";
import MapPin from "@/assets/home/hhw/MapPin.svg";
import Phone from "@/assets/home/hhw/phone.svg";
import Shadow from "@/assets/home/hhw/shadow.svg";
import Tick from "@/assets/home/hhw/tick.svg";
import Star from "@/assets/home/hhw/yellowStar.svg";
import VerifiedIcon from "@/assets/home/offers/VerifiedIcon.svg";
import SectionHeaderWithDivider from "@/components/shared/SectionHeaderWithDivider";
import { cardHeading } from "@/utils/fonts";

export default function HHW() {
  return (
    <section role="region" aria-label="How Homezup Works Section" className="">
      <div className="container px-5 pb-16">
        {/* Main section heading */}
        <SectionHeaderWithDivider
          heading={<span id="latest-offers-heading">How Homezup Works</span>}
          description="Simple steps to connect with trusted home service providers"
        />
        <div className="grid grid-cols-1 items-center justify-items-center gap-10 xl:grid-cols-2">
          <div className="space-y-10">
            <div className="flex items-center justify-center gap-4">
              <MapPin className="text-primary h-8 w-8" aria-hidden="true" />
              <h2 className={`${cardHeading} text-heading`}>Select you city & service</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Star className="fill-supporting text-supporting h-8 w-8" aria-hidden="true" />
              <h2 className={`${cardHeading} text-heading `}>Browse trusted providers</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Phone className="h-8 w-8 fill-green-800 text-green-800" aria-hidden="true" />
              <h2 className={`${cardHeading} text-heading`}>Call or message directly</h2>
            </div>
          </div>
          <div className="flex h-full w-full items-center justify-start  md:justify-center ">
            <div className="hover:shadow-primary relative mx-auto flex h-[300px] w-[200px] rounded-xl bg-white shadow-2xl shadow-black/40  duration-500 xl:h-[400px] xl:w-[300px]">
              <Image
                src={HHMImage}
                alt="How Homezup Works Image"
                height={400}
                width={300}
                className="z-20 h-full w-full rounded-xl"
              />
              <div className="absolute bottom-0 left-1 z-30 w-[90%]">
                <div className="h-full w-full p-2">
                  <div className="flex items-center gap-2 ">
                    <h3
                      className={`font-poppins overflow-x-hidden text-ellipsis whitespace-nowrap   text-[clamp(14px,3vw,18px)] font-semibold leading-[28px] text-white  `}
                    >
                      Hassan M.
                    </h3>
                    <VerifiedIcon className="fill-primary h-4 w-4 text-white " />
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <h4
                      className={`font-roboto text-[clamp(8px,1.5vw,12px)] font-semibold leading-[24px]  text-white`}
                    >
                      98 jobs completed
                    </h4>
                    <div
                      className={`font-roboto text- flex items-center gap-1 text-[clamp(8px,1.5vw,12px)] font-semibold text-white`}
                    >
                      <MapPin className="h-2 w-2 fill-white" />
                      <span>Rabat</span>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <h4
                      className={`font-roboto text-[clamp(8px,1.5vw,12px)] font-semibold leading-[24px] text-white`}
                    >
                      Ratings
                    </h4>
                    <div className="flex items-center justify-center gap-1 text-[clamp(8px,1.5vw,12px)]">
                      <Star className="text-supporting fill-supporting h-3 w-3" />
                      <span className=" font-semibold text-white">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center  gap-1 ">
                    <span
                      className={`font-roboto text-primary bg-secondary rounded-full px-2 text-[clamp(10px,30%,14px)] font-bold  leading-[24px]`}
                    >
                      Electrical
                    </span>
                    <span
                      className={`font-roboto text-primary bg-secondary rounded-full px-2 text-[clamp(10px,30%,14px)] font-bold  leading-[24px]`}
                    >
                      AC Repair
                    </span>
                  </div>
                </div>
              </div>
              <Shadow className="scale-x-70 xl:scale-120 absolute right-[-100px] top-[-100px] z-10 block md:scale-100 " />

              <div className="absolute bottom-[-55px] right-[-55px] z-30">
                <Tick className="h-[80px] w-[80px]" />
              </div>
              <div className="h-30 w-15 absolute bottom-[-25px] right-[-25px] hidden xl:block">
                <div className=" bg-primary absolute bottom-0 left-0 h-4 w-3 rounded-full" />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#F87171]" />
                <div className="absolute right-0 top-16 h-2 w-3 rounded-full bg-[#C084FC]" />
                <div className="top-13 bg-supporting absolute right-3 h-2 w-2 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
