import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UNIIntern",
    short_name: "UNIIntern",
    description: "Connect students with internships and courses",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff8904",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
