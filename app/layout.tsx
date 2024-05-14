import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import Script from 'next/script';
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import BetaBanner from "@/components/ui/Beta";

const inter = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bayard_One By Bayard Lab | RAG Generative AI LGBTQ+ Research Assistant",
  description: "Bayard_One: An open-source AI research assistant leveraging RAG to provide accessible insights into LGBTQ+ scholarship. Discover groundbreaking studies and empower your research with Bayard Lab's innovative platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N984G6H2');` }} />
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <div className="sticky top-0 z-50">
            <Header />
            <BetaBanner />
          </div>
          <main className="relative">
            {children}
          </main>
          <div className="sticky bottom-50 z-50">
            <Footer />
          </div>
        </div>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N984G6H2"
          height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe>
        </noscript>
      </body>
    </html>
  );
}