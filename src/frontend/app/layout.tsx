import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

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
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <link rel="canonical" href="https://getbootstrap.com/docs/5.0/examples/sticky-footer-navbar/" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossOrigin="anonymous"></script>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />




      <body className="d-flex flex-column h-100"
        style={{
          backgroundColor: "var(--light-background-color)",
        }}
      >


        <header>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top"
            style={{
              backgroundColor: "var(--dark-background-color)",
              minHeight: "150px"
            }}>
            <div className="container-fluid ">
              <img src="/main.png" alt="Logo" height={150} className='' />
              <a className="navbar-brand d-flex align-items-center justify-content-center" href="/">
                Info21 v2.0 Web
              </a>

              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/data">Data</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/operations">Operations</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/sql-request">SQL Request</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>


        <main className="flex-shrink-0" style={{
          margin: "160px 0px 0px 0px",
        }}>
          {children}
        </main>

        <footer className="footer mt-auto py-3"
          style={{
            backgroundColor: "var(--dark-background-color)",
            color: "var(--white-color)",
          }}>
          <div className="container text-center">
            <span>pintoved, someone. All rights reserved.</span>
          </div>
        </footer>

      </body >
    </html >
  );
}
