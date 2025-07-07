
/**
 * Centralized URL Configuration
 * All service URLs are managed here for better organization
 */

// Get URLs from environment variables or use fallbacks
const getEnvUrl = (key: string, fallback: string) => {
  return import.meta.env[key] || fallback;
};

export const URLS = {
  // Ollama AI Service
  OLLAMA: {
    BASE_URL: getEnvUrl('VITE_OLLAMA_BASE_URL', 'http://localhost:11434'),
    HEALTH_CHECK: '/api/tags',
    GENERATE: '/api/generate'
  },

  // NetBox IPAM/DCIM
  NETBOX: {
    API_BASE_URL: getEnvUrl('VITE_NETBOX_API_URL', 'https://your-netbox-instance.com/api'),
    GRAPHQL_URL: getEnvUrl('VITE_NETBOX_GRAPHQL_URL', 'https://your-netbox-instance.com/graphql/'),
    ENDPOINTS: {
      DEVICES: '/dcim/devices/',
      SITES: '/dcim/sites/',
      VLANS: '/ipam/vlans/',
      DEVICE_ROLES: '/dcim/device-roles/',
      INTERFACES: '/dcim/interfaces/'
    }
  },

  // Network Service Orchestrator (NSO)
  NSO: {
    BASE_URL: getEnvUrl('VITE_NSO_BASE_URL', 'http://your-nso-server:8080'),
    API_VERSION: 'v1'
  },

  // Monitoring and Metrics
  MONITORING: {
    PROMETHEUS_URL: getEnvUrl('VITE_PROMETHEUS_URL', 'http://localhost:9090'),
    GRAFANA_URL: getEnvUrl('VITE_GRAFANA_URL', 'http://localhost:3000'),
    ALERTMANAGER_URL: getEnvUrl('VITE_ALERTMANAGER_URL', 'http://localhost:9093')
  },

  // Configuration Comparison API
  CONFIG_COMPARISON: {
    BASE_URL: getEnvUrl('VITE_CONFIG_COMPARISON_API_URL', 'http://localhost:8000/api')
  }
} as const;

// Default configuration values that don't need to be secret
export const CONFIG = {
  OLLAMA: {
    DEFAULT_MODEL: 'llama3.1'
  },
  
  DEVICE_MANAGEMENT: {
    SNMP_COMMUNITY: 'public',
    TELNET_PORT: 23,
    SSH_PORT: 22,
    HTTP_PORT: 80,
    HTTPS_PORT: 443
  }
} as const;
