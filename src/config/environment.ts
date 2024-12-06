export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3000",
    timeout: 5000,
  },
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  },
};
