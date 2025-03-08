/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Add audio file types to the allowed static assets
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/media/",
            outputPath: "static/media/",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    })
    return config
  },
};

export default nextConfig;
