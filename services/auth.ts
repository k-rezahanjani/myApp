import { ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://moshtarakin.abfaazarbaijan.ir/SanjabServices/token';

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

    // ===================== TOKEN STORAGE =====================

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
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    }

    async getAccessToken() {
        return await SecureStore.getItemAsync('access_token');
    }

    async getRefreshToken() {
        return await SecureStore.getItemAsync('refresh_token');
    }

    async getUserData() {
        const data = await SecureStore.getItemAsync('user_data');
        return data ? JSON.parse(data) : null;
    }

    async clearAllData() {
        const keys = ['access_token', 'refresh_token', 'token_expires', 'user_data'];
        for (const key of keys) {
            await SecureStore.deleteItemAsync(key);
        }
    }

    // ===================== TOKEN CHECK =====================

    async isTokenExpired() {
        const expires = await SecureStore.getItemAsync('token_expires');
        if (!expires) return true;

        return new Date() >= new Date(expires);
    }

    // ===================== LOGIN =====================

    async login(username: string, password: string) {
        const formBody = new URLSearchParams({
            grant_type: 'password',
            client_id: 'ngauth',
            username,
            password
        }).toString();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: formBody
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                await this.setTokens(data);

                return {
                    success: true,
                    data,
                    user: {
                        username: data.userName,
                        fullName: data.fullName,
                        role: data.role
                    }
                };
            }

            return {
                success: false,
                error: data.error_description || data.message || 'خطا در ورود',
                statusCode: response.status
            };

        } catch (error: any) {
            ToastAndroid.show('خطا در شبکه', ToastAndroid.SHORT);

            return {
                success: false,
                error: error.message || 'Network error'
            };
        }
    }

    // ===================== AUTH REQUEST (axios replacement) =====================

    async authFetch(url: string, options: any = {}) {
        const token = await this.getAccessToken();

        const headers = {
            ...(options.headers || {}),
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        // auto refresh on 401
        if (response.status === 401) {
            const refreshed = await this.refreshToken();

            if (refreshed) {
                const newToken = await this.getAccessToken();

                const retryResponse = await fetch(url, {
                    ...options,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${newToken}`
                    }
                });

                return retryResponse;
            }
        }

        return response;
    }

    // ===================== REFRESH TOKEN =====================

    async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) return false;

            const response = await fetch(`${API_URL}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            });

            const data = await response.json();

            if (data?.access_token) {
                await this.setTokens(data);
                return true;
            }

            return false;
        } catch (err) {
            console.error('refresh error', err);
            return false;
        }
    }

    // ===================== LOGOUT =====================

    async logout() {
        try {
            const token = await this.getAccessToken();

            if (token) {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (e) {
            console.log('logout error', e);
        } finally {
            await this.clearAllData();
        }
    }

    // ===================== AUTH CHECK =====================

    async isAuthenticated() {
        const token = await this.getAccessToken();
        if (!token) return false;

        if (await this.isTokenExpired()) {
            return await this.refreshToken();
        }

        return true;
    }
}

export default new AuthService();