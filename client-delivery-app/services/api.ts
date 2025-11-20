import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_API_URL = process.env.EXPO_PUBLIC_AUTH_API_URL || 'http://192.168.48.124:5001';
const DELIVERY_API_URL = process.env.EXPO_PUBLIC_DELIVERY_API_URL || 'http://192.168.48.124:5004';
const ORDER_API_URL = process.env.EXPO_PUBLIC_ORDER_API_URL || 'http://192.168.48.124:5002';

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const orderApi = axios.create({
  baseURL: ORDER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const deliveryApi = axios.create({
  baseURL: DELIVERY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

deliveryApi.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token');
  if (!config) config = {};
  if (!config.headers) config.headers = {} as any;
  if (token) {
    // ensure headers object exists and set Authorization
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token');
  if (!config) config = {};
  if (!config.headers) config.headers = {} as any;
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (data: any): Promise<any> => {
  const res = await authApi.post("/api/auth/register", data);
  return res.data as any;
};

// Auth APIs
export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
  const res = await authApi.post('/api/auth/login', credentials);
  return res.data as any;
};

export const logoutUser = async (): Promise<any> => {
  return await authApi.post('/api/auth/logout');
};

export const toggleAvailabilityAPI = async (): Promise<any> => {
  const res = await authApi.put('/api/users/me/availability/toggle');
  return res.data as any;
};

export const updateProfile = async (data: Partial<any>): Promise<any> => {
  const res = await authApi.put('/api/users/me', data);
  return res.data as any;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<any> => {
  const res = await authApi.put('/api/users/me/password', data);
  return res.data as any;
};

export const getCurrentUser = async (): Promise<any> => {
  const res = await authApi.get('api/auth/me');
  const d: any = res.data;
  return (d && (d.user ?? d)) as any;
};

export const getDeliveryByIdAPI = async (deliveryId: string): Promise<any> => {
  const res = await deliveryApi.get(`/api/deliveries/${deliveryId}`);
  return res.data as any; // { success: true, delivery }
};

export const getCurrentDriverDeliveryAPI = async (): Promise<any> => {
  const res = await deliveryApi.get('/api/deliveries/driver/current');
  return res.data as any; // { success, delivery }
};

export const updateDeliveryStatusAPI = async (deliveryId: string, status: string): Promise<any> => {
  const res = await deliveryApi.patch(`/api/deliveries/${deliveryId}/status`, { status });
  const d: any = res.data;
  return (d && d.delivery) as any;
};

export const updateDeliveryVerification = async (deliveryId: any): Promise<any> => {
  const res = await deliveryApi.patch(`/api/deliveries/${deliveryId}/verify`);
  const d: any = res.data;
  return (d && d.delivery) as any;
};

export const trackDeliveryAPI = async (deliveryId: string): Promise<any> => {
  const res = await deliveryApi.get(`/api/deliveries/track/${deliveryId}`);
  return res.data as any; // { driverLocation, deliveryLocation, route, eta }
};

export const getCurrentMonthEarningsAPI = async (driverId: string): Promise<any> => {
  try {
    const res = await deliveryApi.get(`/api/earnings/current/${driverId}`);
    return res.data as any;
  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    return { success: false, total: 0 };
  }
};

export default { authApi, deliveryApi };
