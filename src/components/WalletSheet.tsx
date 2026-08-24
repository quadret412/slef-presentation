"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SocialLinks } from "./SocialLinks";

type Props = {
  open: boolean;
  accent: string;
  field: string;
  ink: string;
  muted: string;
  chip: string;
  onClose: () => void;
};

export function WalletSheet({
  open,
  accent,
  field,
  ink,
  muted,
  chip,
  onClose,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="wallet-overlay" />
        <Dialog.Content
          className="wallet-content"
          style={{ background: field, color: ink }}
          aria-describedby="wallet-copy"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px]" style={{ color: muted }}>
                Wallet
              </p>
              <Dialog.Title className="mt-1 text-[1.6rem] font-semibold tracking-[-0.03em]">
                $2,480.00
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="cursor-pointer rounded-full px-3 py-1 text-[13px] transition-transform duration-100 ease-out active:scale-[0.97]"
              style={{ background: chip, color: muted }}
            >
              Close
            </Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {["Deposit", "Withdraw"].map((action) => (
              <button
                key={action}
                type="button"
                className="cursor-pointer rounded-full py-2.5 text-[13px] font-medium transition-transform duration-100 ease-out active:scale-[0.97]"
                style={{ background: accent, color: field }}
              >
                {action}
              </button>
            ))}
          </div>

          <Dialog.Description
            id="wallet-copy"
            className="mt-5 text-[13px] leading-6"
            style={{ color: muted }}
          >
            Real dialog: portal, focus trap, scroll lock. This is the hire path
            - not a payment form.
          </Dialog.Description>

          <div className="mt-3" style={{ color: ink }}>
            <SocialLinks tone="inherit" className="-ml-2" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
