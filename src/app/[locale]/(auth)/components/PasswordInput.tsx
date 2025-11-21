import { EyeOff } from "lucide-react"; // or any icon library
import React, { useState } from "react";

import Eye from "@/assets/auth/passwordEye.svg";

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        className="border-secondary font-poppins h-10 w-full rounded-lg border-[2px] p-3 pr-10 text-[14px] font-normal text-[#ADAEBC] outline-none"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-subtext absolute left-auto right-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
