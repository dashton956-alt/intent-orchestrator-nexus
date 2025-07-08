
/**
 * Centralized URL Configuration
 * All external service URLs and endpoints are configured here
 */

export const URLS = {
  // Cisco NSO URLs
  NSO: {
    BASE_URL: import.meta.env.VITE_NSO_BASE_URL || 'http://localhost:8080',
    RESTCONF_URL: '/restconf/data',
    ENDPOINTS: {
      DEVICES: '/tailf-ncs:devices/device',
      SERVICES: '/tailf-ncs:services',
      ROLLBACKS: '/tailf-ncs:rollbacks'
    }
  },

  // NetBox URLs  
  NETBOX: {
    API_BASE_URL: import.meta.env.VITE_NETBOX_API_URL || 'http://localhost:8000/api',
    GRAPHQL_URL: import.meta.env.VITE_NETBOX_GRAPHQL_URL || 'http://localhost:8000/graphql',
    ENDPOINTS: {
      DEVICES: '/dcim/devices/',
      SITES: '/dcim/sites/',
      VLANS: '/ipam/vlans/',
      INTERFACES: '/dcim/interfaces/',
      JOURNAL_ENTRIES: '/extras/journal-entries/'
    }
  },

  // Git Integration URLs
  GIT: {
    API_URL: import.meta.env.VITE_GIT_API_URL || 'https://gitlab.com/api/v4',
    PROJECT_ID: import.meta.env.VITE_GIT_PROJECT_ID || '',
    ENDPOINTS: {
      BRANCHES: '/repository/branches',
      FILES: '/repository/files',
      MERGE_REQUESTS: '/merge_requests',
      COMMITS: '/repository/commits'
    }
  },

  // Ollama URLs
  OLLAMA: {
    BASE_URL: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
    ENDPOINTS: {
      GENERATE: '/api/generate',
      CHAT: '/api/chat',
      MODELS: '/api/tags'
    }
  }
} as const;
