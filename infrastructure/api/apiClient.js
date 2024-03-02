import axios from 'axios';

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
export function setTokenExpirationTimes({
  accessExpirationTime,
  refreshExpirationTime
}) {
  accessExpirationTime &&
    localStorage.setItem('accessTokenExpirationTime', accessExpirationTime);
  refreshExpirationTime &&
    localStorage.setItem('refreshTokenExpirationTime', refreshExpirationTime);
}

const refreshToken = async () => {
  const response = await apiClient.post('auth/token/refresh/');
  apiClient.defaults.headers.common['Authorization'] = response.data.access
    ? `Bearer ${response.data.access}`
    : null;
  localStorage.setItem('access', response.data.access);
  setTokenExpirationTimes({
    refreshExpirationTime: new Date(response.data.access_expiration).getTime()
  });
  return response.data.access;
};

apiClient.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.getItem('access')
    ? `Bearer ${localStorage.getItem('access')}`
    : null;
  return config;
});
apiClient.interceptors.request.use(
  async config => {
    const urlsToSkip = ['token/', 'logout/'];
    const urlChecker = url => config.url.includes(url);
    const runIntercept = !urlsToSkip.some(urlChecker);
    if (runIntercept) {
      const expirationTime = localStorage.getItem('accessTokenExpirationTime');
      if (expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime > expirationTime) {
          const newAccessToken = await refreshToken();
          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
export default apiClient;
