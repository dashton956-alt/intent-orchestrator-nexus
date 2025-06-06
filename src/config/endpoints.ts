
/**
 * Application Endpoints Configuration
 * 
 * IMPORTANT: Update these URLs to match your actual service deployments
 */

export const ENDPOINTS = {
  // Ollama AI Service Configuration
  OLLAMA: {
    BASE_URL: 'http://localhost:11434', // UPDATE: Change to your Ollama server IP/domain
    DEFAULT_MODEL: 'llama3.1',
    HEALTH_CHECK: '/api/tags',
    GENERATE: '/api/generate'
  },

  // NetBox IPAM/DCIM Configuration
  NETBOX: {
    API_BASE_URL: 'https://your-netbox-instance.com/api', // UPDATE: Your NetBox instance URL
    GRAPHQL_URL: 'https://your-netbox-instance.com/graphql/', // UPDATE: Your NetBox GraphQL endpoint
    API_TOKEN: 'YOUR_NETBOX_TOKEN_HERE', // UPDATE: Your NetBox API token
    ENDPOINTS: {
      DEVICES: '/dcim/devices/',
      SITES: '/dcim/sites/',
      VLANS: '/ipam/vlans/',
      DEVICE_ROLES: '/dcim/device-roles/',
      INTERFACES: '/dcim/interfaces/'
    }
  },

  // Network Service Orchestrator (NSO) Configuration
  NSO: {
    BASE_URL: 'http://your-nso-server:8080', // UPDATE: Your NSO server URL
    API_VERSION: 'v1',
    USERNAME: 'admin', // UPDATE: Your NSO username
    PASSWORD: 'admin' // UPDATE: Your NSO password (consider using environment variables)
  },

  // Monitoring and Metrics
  MONITORING: {
    PROMETHEUS_URL: 'http://localhost:9090', // UPDATE: Your Prometheus server
    GRAFANA_URL: 'http://localhost:3000', // UPDATE: Your Grafana instance
    ALERTMANAGER_URL: 'http://localhost:9093' // UPDATE: Your Alertmanager instance
  },

  // SNMP and Device Management
  DEVICE_MANAGEMENT: {
    SNMP_COMMUNITY: 'public', // UPDATE: Your SNMP community string
    SSH_USERNAME: 'admin', // UPDATE: Default SSH username for devices
    TELNET_PORT: 23,
    SSH_PORT: 22,
    HTTP_PORT: 80,
    HTTPS_PORT: 443
  }
} as const;

/**
 * Environment-specific endpoint overrides
 * These will override the default values above when environment variables are set
 */
export const getEndpoints = () => {
  return {
    ...ENDPOINTS,
    OLLAMA: {
      ...ENDPOINTS.OLLAMA,
      BASE_URL: import.meta.env.VITE_OLLAMA_BASE_URL || ENDPOINTS.OLLAMA.BASE_URL,
      DEFAULT_MODEL: import.meta.env.VITE_OLLAMA_DEFAULT_MODEL || ENDPOINTS.OLLAMA.DEFAULT_MODEL,
    },
    NETBOX: {
      ...ENDPOINTS.NETBOX,
      API_BASE_URL: import.meta.env.VITE_NETBOX_API_URL || ENDPOINTS.NETBOX.API_BASE_URL,
      GRAPHQL_URL: import.meta.env.VITE_NETBOX_GRAPHQL_URL || ENDPOINTS.NETBOX.GRAPHQL_URL,
      API_TOKEN: import.meta.env.VITE_NETBOX_API_TOKEN || ENDPOINTS.NETBOX.API_TOKEN,
    },
    NSO: {
      ...ENDPOINTS.NSO,
      BASE_URL: import.meta.env.VITE_NSO_BASE_URL || ENDPOINTS.NSO.BASE_URL,
      USERNAME: import.meta.env.VITE_NSO_USERNAME || ENDPOINTS.NSO.USERNAME,
      PASSWORD: import.meta.env.VITE_NSO_PASSWORD || ENDPOINTS.NSO.PASSWORD,
    }
  };
};
