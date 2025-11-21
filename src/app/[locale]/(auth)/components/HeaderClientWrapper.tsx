"use client";
import ActionTogglers from "@/components/layout/header/actionTogglers";

export default function HeaderClientWrapper() {
  return (
    <div className="bg-secondary absolute left-5 right-auto top-2 rounded-xl px-3 py-2 rtl:left-auto rtl:right-5">
      <ActionTogglers />
    </div>
  );
}
