import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | UNIINTERN",
  description: "Get in touch with UNIINTERN. Send us your questions or feedback.",
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
