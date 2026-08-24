"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CrateReel } from "./CrateReel";

const seed = [
  "socket.tick  16:41:08",
  "wallet.sync  +$12.00",
  "room.join    184 players",
  "flag.on      offer_modal",
  "socket.tick  16:40:55",
];

export function LiveDesk() {
  const reduce = useReducedMotion();
  const [balance, setBalance] = useState(2480);
  const [players, setPlayers] = useState(184);
  const [log, setLog] = useState<string[]>([...seed]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setPlayers((count) => count + (Math.random() > 0.5 ? 1 : -1));
      setBalance((value) => value + (Math.random() > 0.7 ? 4 : 0));
      setLog((rows) => {
        const next = `socket.tick  ${new Date().toLocaleTimeString("en-GB", { hour12: false })}`;
        return [next, ...rows].slice(0, 5);
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="rounded-[20px] border border-line bg-panel p-5 shadow-[var(--panel-shadow)] sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-steel">Wallet</p>
          <p className="mt-1 tabular text-[2rem] font-semibold tracking-[-0.03em]">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <p className="tabular text-[13px] text-sand-dim">{players} live</p>
      </div>

      <div className="mt-6">
        <CrateReel />
      </div>

      <ul className="mt-5 space-y-1.5 font-mono text-[12px] text-sand-dim">
        {log.map((row, index) => (
          <li key={`${row}-${index}`} className="truncate">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}
