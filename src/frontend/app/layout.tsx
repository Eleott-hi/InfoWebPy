import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";
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

      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/ico" href="{% static 'images/favicon.ico' %}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@300&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="styles.css" />
        <title>Title</title>
      </head>

      <body>
        <div className="container-custom">
          <header>
            <div className="left">
              <img src="main.png" height="150px" />
            </div>

            <div className="middle text-center">
              <h2>Info21 v2.0 Web</h2>
            </div>

            <div className="right">
              <nav>
                <ul>
                  <li className="active" >
                    <a href="/">Main</a>
                  </li>
                  <li className="active" >
                    <a href="/data">Data</a>
                  </li>
                  <li className="active" >
                    <a href="/operations">Operations</a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <main>
            <div className="subsection">
              {children}
            </div>
          </main>

          <footer>
            <div className="footer">
              <p>pintoved,&nbsp;someome&nbsp;<b>©</b>&nbsp;2024.&nbsp;All&nbsp;rights&nbsp;reserved</p>
            </div>
          </footer>

        </div >
      </body >

    </html >
  );
}
