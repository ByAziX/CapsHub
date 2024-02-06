import { ChakraProvider } from "@chakra-ui/react";
import { WalletConnectProvider } from '../components/navbar/WalletConnectProvider';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';


import theme from "../theme";
import { AppProps } from "next/app";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletConnectProvider>

      <NavBar />
      <Component {...pageProps} />
      <Footer />
      </WalletConnectProvider>
      <SpeedInsights />
      <Analytics />
    </ChakraProvider>

  );
}

export default MyApp;
