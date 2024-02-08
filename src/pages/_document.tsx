import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="description" content="CapsHub" />
        <meta name="keywords" content="CapsHub" />
        <meta name="author" content="CapsHub" />
        <meta name="robots" content="index, follow" />
        <meta name="og:title" property="og:title" content="CapsHub" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CapsHub" />
        <meta property="og:description" content="CapsHub" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@CapsHub" />
        <meta name="twitter:creator" content="@CapsHub" />
        <meta name="twitter:title" content="CapsHub" />
        <meta name="twitter:description" content="CapsHub" />
        <meta name="theme-color" content="#319795" />
        <meta name="msapplication-TileColor" content="#319795" />
        <meta name="application-name" content="CapsHub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style
        " content="default" />
        <meta name="apple-mobile-web-app-title" content="CapsHub" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#319795" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#319795" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>CapsHub</title>
        <body>
          
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
