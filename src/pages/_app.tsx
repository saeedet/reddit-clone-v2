import React, { useEffect } from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";
import type { AppProps } from "next/app";
import Amplify from "aws-amplify";
import ProgressBar from "@badrap/bar-of-progress";
import awsconfig from "../aws-exports";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";
import Router from "next/router";

const progress = new ProgressBar({
  size: 4,
  color: "white",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

Amplify.configure({ ...awsconfig, ssr: true });

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Reddit Clone</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AuthContext>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Header />
          <div style={{ width: "90vw", height: 60 }} />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthContext>
    </>
  );
}

export default MyApp;
