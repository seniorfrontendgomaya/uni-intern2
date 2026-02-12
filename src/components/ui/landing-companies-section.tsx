import Image from "next/image";

const companyLogos = [
  { src: "/assets/company/img-01.png", alt: "Company logo" },
  { src: "/assets/company/img-02.png", alt: "Company logo" },
  { src: "/assets/company/img-03.png", alt: "Company logo" },
  { src: "/assets/company/img-04.png", alt: "Company logo" },
  { src: "/assets/company/img-05.png", alt: "Company logo" },
];

const stats = [
  { value: "100+", label: "companies hiring" },
  { value: "1k+", label: "new openings everyday" },
  { value: "10k+", label: "active students" },
  { value: "26k+", label: "learners" },
];

export function LandingCompaniesSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold text-foreground md:text-4xl">
          Top companies trust us
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {companyLogos.map((logo) => (
            <div
              key={logo.src}
              className="flex h-14 w-24 shrink-0 items-center justify-center sm:h-16 sm:w-28"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={112}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-blue-600 md:text-4xl lg:text-5xl">
                {stat.value}
              </span>
              <span className="mt-1 text-base text-gray-700">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
