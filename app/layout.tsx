import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";

const inter = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bayard_One By Bayard Lab | RAG Generative AI LGBTQ+ Research Assistant",
  description:
    "Bayard_One: An open-source AI research assistant leveraging RAG to provide accessible insights into LGBTQ+ scholarship. Discover groundbreaking studies and empower your research with Bayard Lab's innovative platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
