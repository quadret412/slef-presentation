"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/profile";
import { ArrowIcon, DownloadIcon } from "./Icons";
import { FileMark, ReactMark, VueMark } from "./marks/TechMarks";

const easeOut = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="mx-auto grid max-w-[72rem] items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12 lg:py-10"
    >
      <motion.figure
        className="relative aspect-[4/5] max-h-[34rem] overflow-hidden rounded-[20px] bg-bg-raised shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:aspect-[5/6] lg:max-h-[38rem]"
        initial={reduce ? false : { opacity: 0.85, scale: 1.02 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, ease: easeOut }}
      >
        <Image
          src={profile.photo.src}
          alt={profile.photo.alt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 92vw"
          className="object-cover object-[38%_20%]"
        />
        <figcaption className="sr-only">{profile.photo.alt}</figcaption>
      </motion.figure>

      <div className="flex flex-col justify-center">
        <motion.h1
          className="max-w-[11ch] text-[clamp(2.75rem,8vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-sand"
          initial={reduce ? false : { opacity: 0.7, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.12, ease: easeOut }}
        >
          {profile.name}
        </motion.h1>
        <motion.p
          className="mt-5 max-w-[38rem] text-[1.125rem] leading-[1.55] text-sand-dim sm:text-[1.25rem]"
          initial={reduce ? false : { opacity: 0.75, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: reduce ? 0 : 0.22, ease: easeOut }}
        >
          {profile.title}. {profile.offer}
        </motion.p>
        <motion.p
          className="mt-3 text-[14px] text-steel"
          initial={reduce ? false : { opacity: 0.8, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: reduce ? 0 : 0.3, ease: easeOut }}
        >
          {profile.location} · {profile.workMode}
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0.8, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: reduce ? 0 : 0.4, ease: easeOut }}
        >
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-sand px-5 py-2.5 text-[14px] font-medium text-bg transition-transform duration-100 ease-out hover:bg-sand-hover active:scale-[0.97]"
          >
            Get in touch
            <ArrowIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={profile.resumeHref}
            download={profile.resumeFile}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-sand transition-[background,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fill active:scale-[0.97]"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            Download resume
          </a>
        </motion.div>
        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={reduce ? false : { opacity: 0.8, transform: "translateY(8px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.65, delay: reduce ? 0 : 0.48, ease: easeOut }}
        >
          <VueMark className="h-7 w-7" />
          <ReactMark className="h-7 w-7" />
          <FileMark src="/marks/typescript.svg" className="h-7 w-7" />
          <span className="text-[13px] text-sand-dim">Vue daily · React when needed · TS always</span>
        </motion.div>
      </div>
    </section>
  );
}
