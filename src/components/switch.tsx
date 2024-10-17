import { Switch as HLSwitch } from "@headlessui/react";
import { useState } from "react";

interface SwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => unknown;
}

export function Switch({ enabled, onChange }: SwitchProps) {
  return (
    <HLSwitch
      checked={enabled}
      onChange={onChange}
      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-ctp-peach/50"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
      />
    </HLSwitch>
  );
}
