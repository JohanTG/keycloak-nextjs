import '../styles/globals.scss'
import type {AppContext, AppProps} from 'next/app'
import getConfig from "next/config";

// Authentication
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr'
import { IncomingMessage } from 'http'
import cookie from 'cookie'

interface AppPropsWithCookie extends AppProps {
  cookies: any
}

const App = ({ Component, pageProps, cookies }: AppPropsWithCookie) => {
  const { publicRuntimeConfig } = getConfig()

  const keycloakCfg = {
    url: publicRuntimeConfig.keycloak.baseUrl,
    realm: publicRuntimeConfig.keycloak.realm,
    clientId: publicRuntimeConfig.keycloak.clientId,
  }

  const keycloakInitOptions = {
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: `${publicRuntimeConfig.baseUrl}/silent-check-sso.html`,
    pkceMethod: 'S256',
  }

  return (
      <SSRKeycloakProvider
          keycloakConfig={keycloakCfg}
          persistor={SSRCookies(cookies)}
          initOptions={keycloakInitOptions}
      >
        <Component {...pageProps} />
      </SSRKeycloakProvider>
  )
}

const parseCookies = (req?: IncomingMessage) => req?.headers ? cookie.parse(req.headers.cookie || '') : {}

App.getInitialProps = async (context: AppContext) => ({
  cookies: parseCookies(context?.ctx?.req)
})

export default App
