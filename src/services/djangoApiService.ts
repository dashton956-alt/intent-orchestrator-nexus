
import { toast } from "@/hooks/use-toast";

// Django API Service for backend integration
export class DjangoApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('django_token', token);
  }

  // Get stored token
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('django_token');
    }
    return this.token;
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('django_token');
  }

  // Generic API request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request<{
      user: any;
      access: string;
      refresh: string;
    }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.access);
    return response;
  }

  async register(email: string, password: string, fullName?: string) {
    const response = await this.request<{
      user: any;
      access: string;
      refresh: string;
    }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password,
        full_name: fullName 
      }),
    });

    this.setToken(response.access);
    return response;
  }

  async getProfile() {
    return this.request<any>('/auth/profile/');
  }

  // Network Devices
  async getNetworkDevices() {
    return this.request<any[]>('/devices/');
  }

  async createNetworkDevice(deviceData: any) {
    return this.request<any>('/devices/', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateNetworkDevice(deviceId: string, deviceData: any) {
    return this.request<any>(`/devices/${deviceId}/`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  // Network Intents
  async getNetworkIntents() {
    return this.request<any[]>('/intents/');
  }

  async createNetworkIntent(intentData: any) {
    return this.request<any>('/intents/', {
      method: 'POST',
      body: JSON.stringify(intentData),
    });
  }

  async updateNetworkIntent(intentId: string, intentData: any) {
    return this.request<any>(`/intents/${intentId}/`, {
      method: 'PUT',
      body: JSON.stringify(intentData),
    });
  }

  // Network Metrics
  async getNetworkMetrics() {
    return this.request<any[]>('/metrics/');
  }

  async createNetworkMetric(metricData: any) {
    return this.request<any>('/metrics/', {
      method: 'POST',
      body: JSON.stringify(metricData),
    });
  }

  // Network Alerts
  async getNetworkAlerts() {
    return this.request<any[]>('/alerts/');
  }

  async updateNetworkAlert(alertId: string, alertData: any) {
    return this.request<any>(`/alerts/${alertId}/`, {
      method: 'PUT',
      body: JSON.stringify(alertData),
    });
  }

  // Merge Requests
  async getMergeRequests() {
    return this.request<any[]>('/merge-requests/');
  }

  async createMergeRequest(mrData: any) {
    return this.request<any>('/merge-requests/', {
      method: 'POST',
      body: JSON.stringify(mrData),
    });
  }

  async updateMergeRequest(mrId: string, mrData: any) {
    return this.request<any>(`/merge-requests/${mrId}/`, {
      method: 'PUT',
      body: JSON.stringify(mrData),
    });
  }

  // Activity Logs
  async getActivityLogs() {
    return this.request<any[]>('/activity/');
  }
}

export const djangoApiService = new DjangoApiService();
