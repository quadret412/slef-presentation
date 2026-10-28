"use client";

import { DownloadIcon } from "./Icons";
import { useResumeDownload } from "@/lib/resume-region";

export function ResumeDownload({
  className,
  label = "Download resume",
  showIcon = true,
}: {
  className?: string;
  label?: string;
  showIcon?: boolean;
}) {
  const { primary } = useResumeDownload();

  return (
    <a href={primary.href} download={primary.file} className={className}>
      {showIcon ? <DownloadIcon className="h-3.5 w-3.5" /> : null}
      {label}
    </a>
  );
}

/** Small secondary link to the other resume format. */
export function ResumeAlternate({ className }: { className?: string }) {
  const { alternate } = useResumeDownload();

  return (
    <a href={alternate.href} download={alternate.file} className={className}>
      {alternate.label}
    </a>
  );
}
