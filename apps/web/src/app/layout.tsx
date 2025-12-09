import "./globals.css";

export const metadata = {
  title: "FY Club",
  description: "AI Risk & Rebalancing for DeFi Treasuries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
