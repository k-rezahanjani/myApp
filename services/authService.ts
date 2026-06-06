import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ToastAndroid } from 'react-native';

// const API_URL = 'http://ardabfa.ir/sanjabservice/token';
const API_URL = 'http://emeter.abfasb.ir/sanjabServicesTest/token';
// const API_URL = 'https://moshtarakin.abfaazarbaijan.ir/SanjabServices/token';

interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    'as:client_id': string;
    userName: string;
    fullName: string;
    role: string;
    '.issued': string;
    '.expires': string;
}

class AuthService {
    async setTokens(authData: AuthResponse) {
        try {
            await SecureStore.setItemAsync('access_token', authData.access_token);
            await SecureStore.setItemAsync('refresh_token', authData.refresh_token);
            await SecureStore.setItemAsync('token_expires', authData['.expires']);
            await SecureStore.setItemAsync('user_data', JSON.stringify({
                userName: authData.userName,
                fullName: authData.fullName,
                role: authData.role
            }));
            console.log('Tokens saved successfully', authData);
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    }

    async getAccessToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('access_token');
    }

    async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('refresh_token');
    }

    async getUserData() {
        try {
            const userData = await SecureStore.getItemAsync('user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            return null;
        }
    }

    async isTokenExpired(): Promise<boolean> {
        const expires = await SecureStore.getItemAsync('token_expires');
        if (!expires) return true;

        const expirationDate = new Date(expires);
        const now = new Date();
        return now >= expirationDate;
    }

    async login(username: string, password: string) {
        debugger
        const formBody = new URLSearchParams({
            grant_type: 'password',
            client_id: 'ngauth',
            username: username,
            password: password
        }).toString();

        try {
            const response = await fetch(`${API_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: formBody
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                await this.setTokens(data);

                this.setAuthorizationHeader(data.access_token);

                return {
                    success: true,
                    data: data,
                    user: {
                        username: data.userName,
                        fullName: data.fullName,
                        role: data.role
                    }
                };
            } else {
                return {
                    success: false,
                    error: data.error_description || data.message || 'خطا در ورود به سیستم',
                    statusCode: response.status
                };
            }
        } catch (error: any) {
            ToastAndroid.show('خطا در شبکه', 0.5)
            console.log("Error ", error)
            if (error.message === 'Network request failed') {
                return {
                    success: false,
                    error: 'خطا در اتصال به شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.'
                };
            }

            return {
                success: false,
                error: error.message || 'خطا در ارتباط با سرور'
            };
        }
    }

    setAuthorizationHeader(token: string) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) return false;

            const response = await axios.post(`${API_URL}/refresh-token`, {
                refresh_token: refreshToken
            });

            if (response.data && response.data.access_token) {
                await this.setTokens(response.data);
                this.setAuthorizationHeader(response.data.access_token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    }

    async logout() {
        try {
            const accessToken = await this.getAccessToken();

            if (accessToken) {
                await fetch(`${API_URL}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            }
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            await this.clearAllData();

            delete axios.defaults.headers.common['Authorization'];
        }
    }

    async clearAllData() {
        const keys = [
            'access_token',
            'refresh_token',
            'token_expires',
            'user_data'
        ];

        for (const key of keys) {
            await SecureStore.deleteItemAsync(key);
        }
        console.log('logout succeed')
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const token = await this.getAccessToken();
            if (!token) return false;

            const expired = await this.isTokenExpired();
            if (expired) {
                const refreshed = await this.refreshToken();
                return refreshed;
            }

            return true;
        } catch (error) {
            console.error('isAuthenticated error:', error);
            return false;
        }
    }

    createAuthenticatedRequest() {
        const instance = axios.create();

        instance.interceptors.request.use(
            async (config: any) => {
                const token = await this.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            (response: any) => response,
            async (error: any) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const refreshed = await this.refreshToken();
                    if (refreshed) {
                        const newToken = await this.getAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }
}

export default new AuthService();