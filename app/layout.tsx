import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chat Agency: The Agency Alternative",
  description: "The fastest way to validate an idea.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <Header />
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
