import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { IBM_Plex_Mono } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';

const ibmPlexMono = IBM_Plex_Mono({ weight: ["400"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className={ibmPlexMono.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
