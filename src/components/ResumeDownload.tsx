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
  const resume = useResumeDownload();

  return (
    <a href={resume.href} download={resume.file} className={className}>
      {showIcon ? <DownloadIcon className="h-3.5 w-3.5" /> : null}
      {label}
    </a>
  );
}
