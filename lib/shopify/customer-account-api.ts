

import { createHash, randomBytes } from 'crypto';


const getShopDomain = (): string => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || '';
  return domain.replace(/^https?:\/\//, '');
};


export function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}


export function generateCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}


export function generateState(): string {
  return randomBytes(16).toString('base64url');
}


export function generateNonce(): string {
  return randomBytes(16).toString('base64url');
}


export interface OpenIDConfig {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  issuer: string;
}

export interface CustomerAccountAPIConfig {
  graphql_api: string;
  mcp_api?: string;
}


export async function discoverOpenIDConfig(): Promise<OpenIDConfig> {
  const shopDomain = getShopDomain();
  const discoveryUrl = `https://${shopDomain}/.well-known/openid-configuration`;

  const response = await fetch(discoveryUrl);
  if (!response.ok) {
    throw new Error(`Failed to discover OpenID config: ${response.statusText}`);
  }

  return await response.json();
}


export async function discoverCustomerAccountAPI(): Promise<CustomerAccountAPIConfig> {
  const shopDomain = getShopDomain();
  const discoveryUrl = `https://${shopDomain}/.well-known/customer-account-api`;

  const response = await fetch(discoveryUrl);
  if (!response.ok) {
    throw new Error(`Failed to discover Customer Account API: ${response.statusText}`);
  }

  return await response.json();
}


export async function buildAuthorizationUrl(params: {
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  locale?: string;
}): Promise<string> {
  const { redirectUri, state, nonce, codeChallenge, locale = 'es' } = params;
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;

  if (!clientId) {
    throw new Error('SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID is not configured');
  }


  const config = await discoverOpenIDConfig();
  const authorizationUrl = new URL(config.authorization_endpoint);


  authorizationUrl.searchParams.append('scope', 'openid email customer-account-api:full');
  authorizationUrl.searchParams.append('client_id', clientId);
  authorizationUrl.searchParams.append('response_type', 'code');
  authorizationUrl.searchParams.append('redirect_uri', redirectUri);
  authorizationUrl.searchParams.append('state', state);
  authorizationUrl.searchParams.append('nonce', nonce);


  authorizationUrl.searchParams.append('code_challenge', codeChallenge);
  authorizationUrl.searchParams.append('code_challenge_method', 'S256');


  if (locale) {
    authorizationUrl.searchParams.append('locale', locale);
  }

  return authorizationUrl.toString();
}


export async function exchangeCodeForToken(params: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<{
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}> {
  const { code, redirectUri, codeVerifier } = params;
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;

  if (!clientId) {
    throw new Error('SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID is not configured');
  }


  const config = await discoverOpenIDConfig();
  const tokenEndpoint = config.token_endpoint;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${response.statusText} - ${error}`);
  }

  return await response.json();
}


export async function customerAccountGraphQL(
  query: string,
  variables: Record<string, any> = {},
  accessToken: string
): Promise<any> {

  const apiConfig = await discoverCustomerAccountAPI();
  const graphqlEndpoint = apiConfig.graphql_api;

  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}


export async function getCustomer(accessToken: string) {
  const query = `
    query {
      customer {
        id
        emailAddress {
          emailAddress
        }
        firstName
        lastName
        phoneNumber {
          phoneNumber
        }
      }
    }
  `;

  const data = await customerAccountGraphQL(query, {}, accessToken);
  return data.customer;
}

