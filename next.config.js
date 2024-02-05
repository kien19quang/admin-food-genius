/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['content.pancake.vn']
  },

  env: {
    BACKEND_URL: "http://localhost:8000",
    JWT_SECRET_KEY: "food-genius-access-token",
    JWT_REFRESH_TOKEN: "food-genius-refresh-token"
  }
}

module.exports = nextConfig
