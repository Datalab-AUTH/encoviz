const keycloak = {
  issuer: 'http://localhost:3000/identity',
  realm: 'GreenDash',
  clientId: 'frontend',
  baseUrl: 'http://localhost:3000/identity/admin/realms/GreenDash'
};


export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api',
  keycloak
};
