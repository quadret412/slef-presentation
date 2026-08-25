import Image from "next/image";
import { profile } from "@/data/profile";
import { asset } from "@/lib/site";

export function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <Image
        src={asset(profile.photo.src)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="atmosphere-photo object-cover object-[30%_20%] blur-3xl saturate-150"
      />
      <div className="atmosphere-steel absolute inset-0" />
      <div className="atmosphere-sand absolute inset-0" />
      <div className="atmosphere-veil absolute inset-0" />
    </div>
  );
}
