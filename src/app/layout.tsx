import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StatusPage",
  description: "Minimal status page application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
          appearance={{ variables: { colorPrimary: "#111827" } }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
