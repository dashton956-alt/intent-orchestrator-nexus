export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      merge_requests: {
        Row: {
          author_email: string | null
          change_number: string | null
          created_at: string | null
          description: string | null
          id: string
          intent_id: string | null
          netbox_mr_id: string | null
          netbox_url: string | null
          reviewers: string[] | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_email?: string | null
          change_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          intent_id?: string | null
          netbox_mr_id?: string | null
          netbox_url?: string | null
          reviewers?: string[] | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_email?: string | null
          change_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          intent_id?: string | null
          netbox_mr_id?: string | null
          netbox_url?: string | null
          reviewers?: string[] | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merge_requests_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "network_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      network_devices: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          last_updated: string | null
          location: string | null
          model: string | null
          name: string
          netbox_id: number | null
          nso_device_name: string | null
          status: string
          type: string
          vendor: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          last_updated?: string | null
          location?: string | null
          model?: string | null
          name: string
          netbox_id?: number | null
          nso_device_name?: string | null
          status?: string
          type: string
          vendor?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          last_updated?: string | null
          location?: string | null
          model?: string | null
          name?: string
          netbox_id?: number | null
          nso_device_name?: string | null
          status?: string
          type?: string
          vendor?: string | null
        }
        Relationships: []
      }
      network_intents: {
        Row: {
          approved_by: string | null
          configuration: string | null
          created_at: string | null
          created_by: string | null
          deployed_at: string | null
          description: string | null
          id: string
          intent_type: string
          natural_language_input: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          configuration?: string | null
          created_at?: string | null
          created_by?: string | null
          deployed_at?: string | null
          description?: string | null
          id?: string
          intent_type: string
          natural_language_input?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          configuration?: string | null
          created_at?: string | null
          created_by?: string | null
          deployed_at?: string | null
          description?: string | null
          id?: string
          intent_type?: string
          natural_language_input?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      network_metrics: {
        Row: {
          device_id: string | null
          id: string
          metric_type: string
          timestamp: string | null
          unit: string | null
          value: number | null
        }
        Insert: {
          device_id?: string | null
          id?: string
          metric_type: string
          timestamp?: string | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          device_id?: string | null
          id?: string
          metric_type?: string
          timestamp?: string | null
          unit?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "network_metrics_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "network_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
