import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Info21 v2.0 Web",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="d-flex flex-column h-100"
        style={{
          backgroundColor: "var(--light-background-color)",
        }}>

        <Header />

        <main className="flex-shrink-0" style={{
          margin: "160px 0px 0px 0px",
        }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

        <Footer />

      </body >
    </html >
  );
}
