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
      benefits: {
        Row: {
          created_at: string
          description: string
          id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          card_theme: string | null
          card_title: string | null
          created_at: string
          id: string
          theme_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_theme?: string | null
          card_title?: string | null
          created_at?: string
          id?: string
          theme_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_theme?: string | null
          card_title?: string | null
          created_at?: string
          id?: string
          theme_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "chat_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_themes: {
        Row: {
          color: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          address: string | null
          average_revenue: number | null
          business_segment: string | null
          company_name: string
          created_at: string | null
          employees_count: number | null
          id: string
          main_products: string | null
          phone: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          average_revenue?: number | null
          business_segment?: string | null
          company_name: string
          created_at?: string | null
          employees_count?: number | null
          id?: string
          main_products?: string | null
          phone?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          average_revenue?: number | null
          business_segment?: string | null
          company_name?: string
          created_at?: string | null
          employees_count?: number | null
          id?: string
          main_products?: string | null
          phone?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      Leads: {
        Row: {
          created_at: string
          id: number
          Name: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          Name?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          Name?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      model: {
        Row: {
          created_at: string
          description: string | null
          enterprise: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          enterprise?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          enterprise?: string | null
          id?: number
        }
        Relationships: []
      }
      modelkeys: {
        Row: {
          apikey: string | null
          created_at: string
          id: number
          model: string | null
          models: number | null
        }
        Insert: {
          apikey?: string | null
          created_at?: string
          id?: number
          model?: string | null
          models?: number | null
        }
        Update: {
          apikey?: string | null
          created_at?: string
          id?: number
          model?: string | null
          models?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "modelkeys_models_fkey"
            columns: ["models"]
            isOneToOne: false
            referencedRelation: "model"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      Persona: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      plan_benefit_mappings: {
        Row: {
          benefit_id: string
          id: string
          plan_id: string
        }
        Insert: {
          benefit_id: string
          id?: string
          plan_id: string
        }
        Update: {
          benefit_id?: string
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_benefit"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_benefits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          chatpump: boolean
          created_at: string | null
          description: string | null
          id: string
          is_paid: boolean
          name: string
          price: number
        }
        Insert: {
          chatpump?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean
          name: string
          price: number
        }
        Update: {
          chatpump?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean
          name?: string
          price?: number
        }
        Relationships: []
      }
      theme_prompts: {
        Row: {
          created_at: string
          id: string
          pattern_prompt: string
          prompt_furtive: string | null
          theme_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pattern_prompt: string
          prompt_furtive?: string | null
          theme_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pattern_prompt?: string
          prompt_furtive?: string | null
          theme_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_prompts_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "chat_themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_openai_apikey: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
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
