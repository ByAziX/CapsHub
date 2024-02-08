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
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#319795" />
        <link rel="shortcut icon" href="/favicon.ico" />

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
