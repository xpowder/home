import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Create the next-intl plugin instance
const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const baseConfig: NextConfig = {
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
};

export default withNextIntl(baseConfig);
