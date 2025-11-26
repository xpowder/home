import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Create the next-intl plugin instance
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend-homezup-production.up.railway.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-002.backblazeb2.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  webpack(config, { dev, isServer }) {
    // ----------------------------
    // ✅ 1. Remove console logs in production (browser only)
    // ----------------------------
    if (!dev && !isServer) {
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push(
        new (require("terser-webpack-plugin"))({
          terserOptions: {
            compress: {
              drop_console: true, // Removes ALL console.*
              drop_debugger: true,
            },
          },
        })
      );
    }

    // ----------------------------
    // Your existing SVG loader
    // ----------------------------
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeDimensions",
                  active: true,
                },
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },

  experimental: {
    optimizeCss: false,
  },
  
  // Ensure proper build output
  output: undefined, // Let Next.js decide based on usage
  
  // Improve build stability
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default withNextIntl(baseConfig);
