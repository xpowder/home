import React, { useEffect, useRef } from "react";

export type CountdownProps = {
  time: string; // format: "H:M:S", example: "6:10:30"
  onComplete?: () => void;
};

const Countdown: React.FC<CountdownProps> = ({ time, onComplete }) => {
  const hoursRef = useRef<HTMLParagraphElement>(null);
  const minutesRef = useRef<HTMLParagraphElement>(null);
  const secondsRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Parse time into total seconds
    const [h, m, s] = time.split(":").map(Number);
    let totalSeconds = h * 3600 + m * 60 + s;

    const updateDOM = () => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hoursRef.current) hoursRef.current.textContent = String(hours).padStart(2, "0");
      if (minutesRef.current) minutesRef.current.textContent = String(minutes).padStart(2, "0");
      if (secondsRef.current) secondsRef.current.textContent = String(seconds).padStart(2, "0");
    };

    updateDOM(); // initial render

    const timer = setInterval(() => {
      totalSeconds -= 1;
      if (totalSeconds < 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
        return;
      }
      updateDOM();
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onComplete]);

  return (
    <div className="flex items-center gap-4 text-center">
      <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-md shadow-black/20">
        <p ref={hoursRef} className="text-primaryDark text-[clamp(18px,1.5vw,24px)] font-bold">
          00
        </p>
        <span className={`font-roboto text-subtext text-[clamp(10px,0.9vw,12px)]  font-normal`}>
          Hours
        </span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-md shadow-black/20">
        <p ref={minutesRef} className="text-[clamp(18px,1.5vw,24px)] font-bold text-[#0891B2]">
          00
        </p>
        <span className={`font-roboto text-subtext text-[clamp(10px,0.9vw,12px)] font-normal`}>
          Minutes
        </span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 shadow-md shadow-black/20">
        <p ref={secondsRef} className="text-[clamp(18px,1.5vw,24px)] font-bold text-green-400">
          00
        </p>
        <span className={`font-roboto text-subtext text-[clamp(10px,0.9vw,12px)] font-normal`}>
          Seconds
        </span>
      </div>
    </div>
  );
};

export default Countdown;
