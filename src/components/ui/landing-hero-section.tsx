import Image from "next/image";
import { Flame } from "lucide-react";

const heroImages = [
  { src: "/assets/banner-01.webp", alt: "Student on campus with folder and documents" },
  { src: "/assets/banner-02.webp", alt: "Business professionals in modern office" },
  { src: "/assets/banner-03.webp", alt: "Student working on laptop outdoors" },
];

export function LandingHeroSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold leading-tight text-[#2563eb] sm:text-4xl md:text-5xl lg:text-6xl">
          Bridging Talent and Opportunity
          <br />
          Across Campuses and Companies
        </h1>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xl font-medium text-gray-800 md:text-2xl">
          Trending on UniIntern
          <Flame className="h-6 w-6 shrink-0 text-orange-500 md:h-7 md:w-7" />
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {heroImages.map((img, index) => (
            <div
              key={img.src}
              className={`relative aspect-5/3 w-full overflow-hidden rounded-xl ${
                index === 0 || index === 2 ? "hidden sm:block" : ""
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
