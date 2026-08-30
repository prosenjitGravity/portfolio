export const environment = {
  production: false,
  enableLogging: true,
  logLevel: "DEBUG",
  // Keep LinkedIn credentials on the server. The frontend only calls this
  // same-origin endpoint, which can be backed by LinkedIn OAuth/API access.
  linkedinProfileApiUrl: '/api/linkedin/profile',
}
