import type { Metadata } from "next";
import { Open_Sans, Geist } from "next/font/google";
import "./globals.css";
import { getThemeBootstrapScript } from "./theme-config";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tianli0.top"),
  title: "Tianli",
  description:
    "Undergraduate student / Front-end / CN & EN & ES",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/site-icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/site-icon.png",
    apple: "/site-icon.png",
  },
  openGraph: {
    title: "Tianli",
    description: "Undergraduate student / Front-end / CN & EN & ES",
    url: "https://www.tianli0.top",
    siteName: "Tianli",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Tianli personal homepage",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tianli",
    description: "Undergraduate student / Front-end / CN & EN & ES",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cn" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />
      </head>
      <body className={`${openSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
