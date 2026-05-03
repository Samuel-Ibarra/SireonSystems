import Image from "next/image";

import { cn } from "@/lib/utils";

type AnimatedVideoProps = {
  src: string;
  poster: string;
  className?: string;
  sizes?: string;
};

export function AnimatedVideo({
  src,
  poster,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: AnimatedVideoProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        aria-hidden="true"
        autoPlay
        className="h-full w-full object-cover motion-reduce:hidden"
        loop
        muted
        playsInline
        poster={poster}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
      <Image
        alt=""
        aria-hidden="true"
        className="hidden object-cover motion-reduce:block"
        fill
        priority={src.includes("hero")}
        sizes={sizes}
        src={poster}
      />
    </div>
  );
}
