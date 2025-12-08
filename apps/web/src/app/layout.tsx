import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FY Club — AI Treasury Guardian",
  description: "On-chain AI risk analysis & autonomous protection for DeFi treasuries"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}