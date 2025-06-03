
import { supabase } from "@/integrations/supabase/client";

// NetBox API Integration Service
export class NetBoxService {
  private baseUrl: string;
  private apiToken: string;

  constructor() {
    // Use Vite environment variables (prefixed with VITE_) or fallback values
    this.baseUrl = import.meta.env.VITE_NETBOX_API_URL || "https://your-netbox-instance.com/api";
    this.apiToken = import.meta.env.VITE_NETBOX_API_TOKEN || "YOUR_NETBOX_TOKEN_HERE";
  }

  // Fetch devices from NetBox
  async fetchDevices() {
    try {
      // TODO: Replace with actual NetBox API call
      const response = await fetch(`${this.baseUrl}/dcim/devices/`, {
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
    // Map NetBox device roles to our device types
    const roleMapping: { [key: string]: string } = {
      'core-switch': 'core',
      'distribution-switch': 'distribution',
      'access-switch': 'access',
      'router': 'core',
      'firewall': 'core',
    };

    return roleMapping[roleSlug] || 'access';
  }

  // Mock data for development
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
      // Add more mock devices as needed
    ];
  }

  // Fetch merge requests from NetBox
  async fetchMergeRequests() {
    try {
      // TODO: Replace with actual NetBox change management API
      // This is a placeholder for NetBox change requests/tickets
      console.log('Fetching merge requests from NetBox...');
      
      // Return mock data for now
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
