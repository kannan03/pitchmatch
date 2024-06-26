import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import { Providers } from './providers'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PitchMatch - AI powered Mail Generator",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <link rel="icon" href="./favicon.ico" sizes="any" />
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}
