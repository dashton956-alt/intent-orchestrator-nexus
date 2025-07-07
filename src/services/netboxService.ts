
import { supabase } from "@/integrations/supabase/client";
import { URLS } from "@/config/urls";
import { secretsService, SECRET_KEYS } from "@/config/secrets";

// NetBox API Integration Service
export class NetBoxService {
  private baseUrl: string;
  private apiToken: string | null = null;

  constructor() {
    this.baseUrl = URLS.NETBOX.API_BASE_URL;
  }

  // Initialize service with API token from secrets
  private async initialize() {
    if (!this.apiToken) {
      this.apiToken = await secretsService.getSecret(SECRET_KEYS.NETBOX_API_TOKEN);
    }
  }

  // Fetch devices from NetBox
  async fetchDevices() {
    try {
      await this.initialize();

      if (!this.apiToken) {
        console.warn('NetBox API token not configured, using mock data');
        return this.getMockDevices();
      }

      const response = await fetch(`${this.baseUrl}${URLS.NETBOX.ENDPOINTS.DEVICES}`, {
        headers: {
          'Authorization': `Token ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch devices from NetBox');
      }

      const data = await response.json();
      
      // Sync devices to local database
      await this.syncDevicesToDatabase(data.results || []);
      
      return data.results;
    } catch (error) {
      console.error('NetBox API Error:', error);
      // Return mock data for now
      return this.getMockDevices();
    }
  }

  // Sync NetBox devices to local database
  private async syncDevicesToDatabase(devices: any[]) {
    for (const device of devices) {
      const { error } = await supabase
        .from('network_devices')
        .upsert({
          name: device.name,
          type: this.mapDeviceType(device.device_role?.name),
          status: device.status?.value === 'active' ? 'online' : 'offline',
          ip_address: device.primary_ip?.address?.split('/')[0],
          location: device.location?.name,
          model: device.device_type?.model,
          vendor: device.device_type?.manufacturer?.name,
          netbox_id: device.id,
          last_updated: new Date().toISOString(),
        }, { 
          onConflict: 'netbox_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error syncing device to database:', error);
      }
    }
  }

  private mapDeviceType(roleSlug: string): string {
    const roleMapping: { [key: string]: string } = {
      'core-switch': 'core',
      'distribution-switch': 'distribution',
      'access-switch': 'access',
      'router': 'core',
      'firewall': 'core',
    };

    return roleMapping[roleSlug] || 'access';
  }

  private getMockDevices() {
    return [
      {
        id: 1,
        name: "Core-SW-01",
        device_role: { name: "core-switch" },
        status: { value: "active" },
        primary_ip: { address: "10.0.1.1/24" },
        location: { name: "Data Center 1" },
        device_type: {
          model: "Catalyst 9500",
          manufacturer: { name: "Cisco" }
        }
      },
    ];
  }

  async fetchMergeRequests() {
    try {
      console.log('Fetching merge requests from NetBox...');
      return this.getMockMergeRequests();
    } catch (error) {
      console.error('NetBox Merge Requests Error:', error);
      return this.getMockMergeRequests();
    }
  }

  private getMockMergeRequests() {
    return [
      {
        id: "NB-001",
        title: "Add new VLAN configuration",
        description: "Adding VLAN 100 for new department",
        status: "review",
        author_email: "network.engineer@company.com",
        created_at: new Date().toISOString(),
      }
    ];
  }
}

export const netboxService = new NetBoxService();
