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
      admin_panel: {
        Row: {
          created_at: string | null
          description: string | null
          feature_name: string
          feature_value: Json
          id: string
          is_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_name: string
          feature_value: Json
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_name?: string
          feature_value?: Json
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      broker_credentials: {
        Row: {
          accesstoken: string | null
          api_key: string | null
          broker_id: number
          broker_name: string
          created_at: string
          id: string
          password: string
          session_id: string | null
          status: string
          two_factor_secret: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          accesstoken?: string | null
          api_key?: string | null
          broker_id: number
          broker_name: string
          created_at?: string
          id?: string
          password: string
          session_id?: string | null
          status?: string
          two_factor_secret?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          accesstoken?: string | null
          api_key?: string | null
          broker_id?: number
          broker_name?: string
          created_at?: string
          id?: string
          password?: string
          session_id?: string | null
          status?: string
          two_factor_secret?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      brokers_functions: {
        Row: {
          broker_id: number
          broker_image: string | null
          broker_name: string
          configuration: Json | null
          created_at: string | null
          function_description: string | null
          function_enabled: boolean | null
          function_name: string
          function_slug: string
          id: string
          is_premium: boolean | null
          updated_at: string | null
        }
        Insert: {
          broker_id: number
          broker_image?: string | null
          broker_name: string
          configuration?: Json | null
          created_at?: string | null
          function_description?: string | null
          function_enabled?: boolean | null
          function_name: string
          function_slug: string
          id?: string
          is_premium?: boolean | null
          updated_at?: string | null
        }
        Update: {
          broker_id?: number
          broker_image?: string | null
          broker_name?: string
          configuration?: Json | null
          created_at?: string | null
          function_description?: string | null
          function_enabled?: boolean | null
          function_name?: string
          function_slug?: string
          id?: string
          is_premium?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_strategies: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          legs: Json
          name: string
          performance: Json | null
          strategy_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          legs: Json
          name: string
          performance?: Json | null
          strategy_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          legs?: Json
          name?: string
          performance?: Json | null
          strategy_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forgot_details: {
        Row: {
          email: string
          id: string
          ip_address: string | null
          is_used: boolean | null
          request_timestamp: string
          reset_token: string | null
          used_timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          email: string
          id?: string
          ip_address?: string | null
          is_used?: boolean | null
          request_timestamp?: string
          reset_token?: string | null
          used_timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          email?: string
          id?: string
          ip_address?: string | null
          is_used?: boolean | null
          request_timestamp?: string
          reset_token?: string | null
          used_timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plan_details: {
        Row: {
          id: string
          is_paid: boolean | null
          plan_name: string
          plan_price: string
          selected_at: string
          user_id: string
        }
        Insert: {
          id?: string
          is_paid?: boolean | null
          plan_name: string
          plan_price: string
          selected_at?: string
          user_id: string
        }
        Update: {
          id?: string
          is_paid?: boolean | null
          plan_name?: string
          plan_price?: string
          selected_at?: string
          user_id?: string
        }
        Relationships: []
      }
      predefined_strategies: {
        Row: {
          description: string
          id: number
          name: string
          parameters: Json
          performance: Json
        }
        Insert: {
          description: string
          id: number
          name: string
          parameters: Json
          performance: Json
        }
        Update: {
          description?: string
          id?: number
          name?: string
          parameters?: Json
          performance?: Json
        }
        Relationships: []
      }
      price_admin: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          plan_description: string | null
          plan_id: string
          plan_name: string
          plan_period: string | null
          plan_price: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          plan_description?: string | null
          plan_id: string
          plan_name: string
          plan_period?: string | null
          plan_price: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          plan_description?: string | null
          plan_id?: string
          plan_name?: string
          plan_period?: string | null
          plan_price?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      send_message: {
        Row: {
          created_at: string | null
          id: string
          message_content: string
          message_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_content: string
          message_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_content?: string
          message_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      strategy_config_options: {
        Row: {
          category: string
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      strategy_selections: {
        Row: {
          broker_username: string | null
          created_at: string | null
          id: string
          is_wishlisted: boolean | null
          paid_status: string
          quantity: number | null
          selected_broker: string | null
          strategy_description: string | null
          strategy_id: number
          strategy_name: string
          trade_type: string | null
          user_id: string
        }
        Insert: {
          broker_username?: string | null
          created_at?: string | null
          id?: string
          is_wishlisted?: boolean | null
          paid_status?: string
          quantity?: number | null
          selected_broker?: string | null
          strategy_description?: string | null
          strategy_id: number
          strategy_name: string
          trade_type?: string | null
          user_id: string
        }
        Update: {
          broker_username?: string | null
          created_at?: string | null
          id?: string
          is_wishlisted?: boolean | null
          paid_status?: string
          quantity?: number | null
          selected_broker?: string | null
          strategy_description?: string | null
          strategy_id?: number
          strategy_name?: string
          trade_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          mobile_number: string
          profile_picture: string | null
          trading_experience: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          mobile_number: string
          profile_picture?: string | null
          trading_experience?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string
          profile_picture?: string | null
          trading_experience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist_maintain: {
        Row: {
          created_at: string
          id: string
          strategy_description: string | null
          strategy_id: number
          strategy_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          strategy_description?: string | null
          strategy_id: number
          strategy_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          strategy_description?: string | null
          strategy_id?: number
          strategy_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      force_strategy_paid_status: {
        Args: {
          p_user_id: string
          p_strategy_id: number
          p_strategy_name: string
          p_strategy_description: string
        }
        Returns: undefined
      }
      get_broker_image: {
        Args: {
          p_broker_id: number
        }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
