import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Resume Generator",
  description: "Create a professional resume in minutes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm fixed w-full">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center max-w-7xl">
            <Link href="/" className="font-bold text-xl text-primary">
              Resume Generator
            </Link>
            <div>
              <Link href="/" className="px-3 py-2 text-gray-700 hover:text-primary">
                Home
              </Link>
              <Link href="/create-resume" className="px-3 py-2 text-gray-700 hover:text-primary">
                Create Resume
              </Link>
            </div>
          </div>
        </nav>
        <div className="pt-8">{children}</div>
      </body>
    </html>
  );
}
