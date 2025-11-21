"use client";
import ActionButtons from "./actionButtons";
import ActionTogglers from "./actionTogglers";

export function HeaderActions() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-5 md:flex-row xl:px-0">
      <ActionTogglers />
      <div>
        <ActionButtons />
      </div>
    </div>
  );
}
