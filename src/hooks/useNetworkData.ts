
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { netboxService } from "@/services/netboxService";
import { nsoService } from "@/services/nsoService";

// Hook to fetch and sync network devices
export const useNetworkDevices = () => {
  return useQuery({
    queryKey: ['network-devices'],
    queryFn: async () => {
      // First try to fetch from NetBox and sync
      try {
        await netboxService.fetchDevices();
      } catch (error) {
        console.log('NetBox sync failed, using local data');
      }

      // Then fetch from local database
      const { data, error } = await supabase
        .from('network_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

// Hook to fetch network intents
export const useNetworkIntents = () => {
  return useQuery({
    queryKey: ['network-intents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('network_intents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook to fetch merge requests
export const useMergeRequests = () => {
  return useQuery({
    queryKey: ['merge-requests'],
    queryFn: async () => {
      // Sync from NetBox first
      try {
        const netboxMRs = await netboxService.fetchMergeRequests();
        
        // Sync to local database
        for (const mr of netboxMRs) {
          await supabase
            .from('merge_requests')
            .upsert({
              netbox_mr_id: mr.id,
              title: mr.title,
              description: mr.description,
              status: mr.status,
              author_email: mr.author_email,
            }, { onConflict: 'netbox_mr_id' });
        }
      } catch (error) {
        console.log('NetBox MR sync failed, using local data');
      }

      // Fetch from local database
      const { data, error } = await supabase
        .from('merge_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

// Hook to fetch network metrics
export const useNetworkMetrics = () => {
  return useQuery({
    queryKey: ['network-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('network_metrics')
        .select('*, network_devices(*)')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};

// Hook to create and deploy network intents
export const useCreateIntent = () => {
  const [loading, setLoading] = useState(false);

  const createIntent = async (intentData: {
    title: string;
    description: string;
    intent_type: string;
    natural_language_input: string;
  }) => {
    setLoading(true);
    try {
      // Create intent in database
      const { data: intent, error } = await supabase
        .from('network_intents')
        .insert({
          ...intentData,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Generate NSO configuration
      const configuration = await nsoService.generateConfiguration(intent);
      
      // Update intent with generated configuration
      await supabase
        .from('network_intents')
        .update({ 
          configuration,
          status: 'pending'
        })
        .eq('id', intent.id);

      return intent;
    } catch (error) {
      console.error('Error creating intent:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createIntent, loading };
};
