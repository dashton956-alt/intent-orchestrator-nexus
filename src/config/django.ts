
/**
 * Django Backend Configuration
 * Configure your Django backend connection here
 */

export const DJANGO_CONFIG = {
  // Django API Base URL
  API_BASE_URL: import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api',
  
  // Django WebSocket URL (for real-time features)
  WS_BASE_URL: import.meta.env.VITE_DJANGO_WS_URL || 'ws://localhost:8000/ws',
  
  // Token storage key
  TOKEN_STORAGE_KEY: 'django_token',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      PROFILE: '/auth/profile/',
      REFRESH: '/auth/token/refresh/',
    },
    DEVICES: '/devices/',
    INTENTS: '/intents/',
    METRICS: '/metrics/',
    ALERTS: '/alerts/',
    MERGE_REQUESTS: '/merge-requests/',
    ACTIVITY: '/activity/',
  }
} as const;
