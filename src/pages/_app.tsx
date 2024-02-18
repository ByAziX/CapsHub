import { ChakraProvider } from "@chakra-ui/react";
import { WalletConnectProvider } from '../components/navbar/WalletConnectProvider';




import theme from "../theme";
import { AppProps } from "next/app";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import { PolkadotProvider } from '@/components/navbar/PolkadotProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <PolkadotProvider>
      <WalletConnectProvider>


      <NavBar />
      <Component {...pageProps} />
      <Footer />
      </WalletConnectProvider>
      </PolkadotProvider>
    </ChakraProvider>

  );
}

export default MyApp;
