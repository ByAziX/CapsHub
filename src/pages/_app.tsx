import { ChakraProvider } from "@chakra-ui/react";
import { WalletConnectProvider } from '../components/navbar/WalletConnectProvider';




import theme from "../theme";
import { AppProps } from "next/app";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import dynamic from 'next/dynamic';

const PolkadotProviderNoSSR = dynamic(() => import('../components/navbar/PolkadotProvider').then((mod) => mod.PolkadotProvider), {
  ssr: false,
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <PolkadotProviderNoSSR>

      <WalletConnectProvider>

      <NavBar />
      <Component {...pageProps} />
      <Footer />
      </WalletConnectProvider>
      </PolkadotProviderNoSSR>

    </ChakraProvider>

  );
}

export default MyApp;
