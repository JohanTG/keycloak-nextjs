/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
  },
  publicRuntimeConfig: {
    baseUrl: "http://localhost:4000",
    keycloak: {
      baseUrl: "http://localhost:4080",
      realm: "RickAndMorty",
      clientId: "wiki"
    }
  },
}

module.exports = nextConfig
