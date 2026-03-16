const domain =
  process.env.REACT_APP_ENV !== "prod"
    ? "http://localhost:8083"
    : "http://localhost:8083";

const baseURL = `${domain}/api/`;
const accessTokenKey = "jwt_access_token";
const refreshTokenKey = "jwt_refresh_token";
const languageKey = "app_language";


const apiConfig = {
  baseURL,
  accessTokenKey,
  refreshTokenKey,
  languageKey,
};

export default apiConfig;
