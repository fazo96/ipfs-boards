import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import AppBar from '../components/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';
import Container from '../components/Container'
import { connectIPFSToBackend } from '../components/system';

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    // Connect IPFS to backend server to improve connectivity
    connectIPFSToBackend().catch(error => console.log('connectIPFSToBackend failed', error))
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>IPFS Boards</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AppBar />
          <Container>
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
