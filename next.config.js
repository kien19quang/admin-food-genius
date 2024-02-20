/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['content.pancake.vn']
  },

  env: {
    BACKEND_URL: process.env.NODE_ENV === 'development' ? "http://localhost:8000" : 'https://server-food-delevery.vercel.app',
    JWT_SECRET_KEY: "food-genius-access-token",
    JWT_REFRESH_TOKEN: "food-genius-refresh-token",
    NEXTAUTH_URL: process.env.NODE_ENV === 'development' ? "http://localhost:3000" : 'https://admin-food-genius.vercel.app',
  }
}

module.exports = nextConfig
