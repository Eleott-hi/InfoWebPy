// pages/_app.tsx
import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: AppContext): Promise<AppProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }
}

export default MyApp;
