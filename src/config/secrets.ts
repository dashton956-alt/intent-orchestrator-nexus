
/**
 * Secret Configuration Service
 * Handles secure storage and retrieval of API keys and sensitive data
 */

import { supabase } from "@/integrations/supabase/client";

export class SecretsService {
  private static instance: SecretsService;
  private secretsCache: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): SecretsService {
    if (!SecretsService.instance) {
      SecretsService.instance = new SecretsService();
    }
    return SecretsService.instance;
  }

  // Get secret from Supabase Edge Functions environment
  async getSecret(key: string): Promise<string | null> {
    try {
      // Check cache first
      if (this.secretsCache.has(key)) {
        return this.secretsCache.get(key)!;
      }

      // Call edge function to get secret
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { key }
      });

      if (error) {
        console.error(`Error retrieving secret ${key}:`, error);
        return null;
      }

      const secretValue = data?.value;
      if (secretValue) {
        // Cache the secret
        this.secretsCache.set(key, secretValue);
      }

      return secretValue || null;
    } catch (error) {
      console.error(`Failed to get secret ${key}:`, error);
      return null;
    }
  }

  // Get multiple secrets at once
  async getSecrets(keys: string[]): Promise<Record<string, string | null>> {
    const secrets: Record<string, string | null> = {};
    
    await Promise.all(
      keys.map(async (key) => {
        secrets[key] = await this.getSecret(key);
      })
    );

    return secrets;
  }

  // Clear secrets cache (useful for testing or when secrets are updated)
  clearCache(): void {
    this.secretsCache.clear();
  }
}

export const secretsService = SecretsService.getInstance();

// Secret keys used in the application
export const SECRET_KEYS = {
  NETBOX_API_TOKEN: 'NETBOX_API_TOKEN',
  NSO_USERNAME: 'NSO_USERNAME',
  NSO_PASSWORD: 'NSO_PASSWORD',
  OLLAMA_API_KEY: 'OLLAMA_API_KEY'
} as const;
