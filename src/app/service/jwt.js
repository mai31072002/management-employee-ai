import { jwtDecode } from "jwt-decode";
import { message } from 'antd';
import axios from "axios";
import history from "@history";
import Utils from "../helpers/utils";
import apiConfig from "../configs/api.config";
import { getStoredLanguage } from "app/i18n/languageStorage";

axios.defaults.baseURL = apiConfig.baseURL;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;
/*delete axios.defaults.headers.common.Authorization; */

axios.interceptors.request.use((config) => {
    const lang = getStoredLanguage();
    config.headers = config.headers || {};
    config.headers["Accept-Language"] = lang;
    return config;
});

class JwtService extends Utils.EventEmitter {
  init() {
    this.handleAuthentication();
  }

    handleAuthentication = () => {
        const dataToken = {
            accessToken: this.getAccessToken(),
            refreshToken: this.getRefreshToken(),
        };
        if (!dataToken.accessToken) {
            this.emit("onNoAccessToken");
            return;
        }

        if (this.isAuthTokenValid(dataToken)) {
            this.setSession(dataToken);
            this.emit("onAutoLogin", true);
        } else {
            this.setSession(null);
            this.emit("onAutoLogout", "access_token expired");
        }
    };

    createUser = (data) =>
        new Promise((resolve, reject) => {
            axios.post("/api/auth/register", data).then((response) => {
                if (response.data.user) {
                    this.setSession(response.data.access_token);
                    resolve(response.data.user);
                } else {
                    reject(response.data.error);
                }
            });
        });

    signInWithUsernameAndPassword = (param) => 
        axios.post("/auth/login", param).then((res) => {
            if (res.data.status !== 200) {
                const msg = res.data?.message || "Tài khoản hoặc mật khẩu không đúng";
                message.error(msg);
                throw new Error(msg);
            }
            this.setSession(res.data.data);
            const decoded = jwtDecode(res.data.data.accessToken);
            const user = {
                data: res.data.data,
                role: decoded.scope,
                redirectUrl: "/home",
            };
            return user;
        });

    signInWithToken = async () => {
        delete axios.defaults.headers.common.Authorization;
        try {
            const res = await axios.post("/auth/refresh-token", {
                refreshToken: this.getRefreshToken(),
            });
            
            if (!res.data.data) {
                this.logout();
                throw new Error("Failed to login with refresh token.");
            }
            const dataToken = {
                accessToken: res.data.data.accessToken,
                refreshToken: res.data.data.refreshToken,
            };
            this.setSession(dataToken);

            const decoded = jwtDecode(res.data.data.accessToken);

            return {
                data: res.data.data,
                role: decoded.scope,
            };
        } catch (error) {
            this.logout();
            throw new Error("Failed to login with refresh token.");
        }
    }
        // axios.post("/auth/refresh-token", { refreshToken: this.getRefreshToken() })
        // .then((res) => {
        //     if (!res.data.data) {
        //         throw new Error("Failed to login with refresh token.");
        //     }
        //     this.setSession(res.data.data);
        //     return {
        //         data: res.data.data,
        //         role: "USER",
        //     };
        // })
        // .catch(() => {
        //     this.logout();
        //     throw new Error("Failed to login with refresh token.");
        // });

    // signInWithToken = async () => {
    //     delete axios.defaults.headers.common.Authorization;
    //     try {
    //         const res = await axios.post("/auth/refresh-token", {
    //             refreshToken: this.getRefreshToken(),
    //         });
            
    //         if (!res.data.data) {
    //             this.logout();
    //             throw new Error("Please login!!!");
    //         }
    //         const dataToken = {
    //             accessToken: res.data.data.accessToken,
    //             refreshToken: res.data.data.refreshToken,
    //         };
    //         this.setSession(dataToken);
    //         return dataToken.accessToken;
    //     } catch (error) {
    //         this.logout();
    //         throw new Error("Failed to login with refresh token.");
    //     }
    // };

    getUserDetail = () => {
        const token = localStorage.getItem("jwt_access_token");
        if (!token) {
            return Promise.reject("No access token found");
        }

        const decoded = jwtDecode(token);
    
        return axios.get(`/users/${decoded.UId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })    
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            throw error;
        });
    };

    updateUserData = (user) => axios.post("/api/auth/user/update", { user });

    setSession = (dataToken) => {
        if (dataToken?.accessToken) {
            window.localStorage.setItem(
                apiConfig.accessTokenKey,
                dataToken.accessToken
            );
            window.localStorage.setItem(
                apiConfig.refreshTokenKey,
                dataToken.refreshToken
            );
        } else {
            window.localStorage.removeItem(apiConfig.accessTokenKey);
            window.localStorage.removeItem(apiConfig.refreshTokenKey);
            delete axios.defaults.headers.common.Authorization;
        }
    };

    logout = () => {
        window.localStorage.removeItem(apiConfig.accessTokenKey);
        window.localStorage.removeItem(apiConfig.refreshTokenKey);
        delete axios.defaults.headers.common.Authorization;
        history.push({
            pathname: "/",
        });
    };
    
    logoutSpecial = () => {
        window.localStorage.removeItem(apiConfig.accessTokenKey);
        window.localStorage.removeItem(apiConfig.refreshTokenKey);
        delete axios.defaults.headers.common.Authorization;
        history.push("/home-login");
    };

    isAuthTokenValid = (dataToken) => {
        if (!dataToken) {
            return false;
        }
        const decodedRefreshToken = jwtDecode(dataToken.refreshToken);
        
        const decoded = jwtDecode(dataToken.accessToken);
        
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime && decodedRefreshToken.exp < currentTime) {
            console.warn("access token and refresh token expired");
            history.push("/");
            return false;
        }
        return true;
    };

    isTokenExpired = () => {
        const decodedRefreshToken = jwtDecode(
            window.localStorage.getItem(apiConfig.refreshTokenKey)
        );
        const decoded = jwtDecode(
            window.localStorage.getItem(apiConfig.accessTokenKey)
        );
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime && decodedRefreshToken > currentTime) {
            return false;
        }
        return true;
    };

    getAccessToken = () => window.localStorage.getItem(apiConfig.accessTokenKey);
    getRefreshToken = () => window.localStorage.getItem(apiConfig.refreshTokenKey);
}

const instance = new JwtService();

export default instance;
