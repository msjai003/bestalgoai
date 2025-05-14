
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      plan_details: {
        Row: {
          id: string
          user_id: string
          plan_name: string
          plan_price: string
          selected_at: string
          is_paid: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_name: string
          plan_price: string
          selected_at?: string
          is_paid?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_name?: string
          plan_price?: string
          selected_at?: string
          is_paid?: boolean | null
        }
      }
      price_admin: {
        Row: {
          id: string
          plan_id: string
          plan_name: string
          plan_description: string | null
          plan_price: string
          plan_period: string | null
          features: Json | null
          is_popular: boolean | null
          sort_order: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          mobile_number: string | null
          trading_experience: string | null
          profile_picture: string | null
          is_research_analyst: boolean | null
          approved: boolean | null
          can_create_strategies: boolean | null
          created_at: string | null
          updated_at: string | null
          license_number: string | null
        }
      }
      signup: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      all_strategy_metrics: {
        Row: {
          strategy_name: string
          overall_profit: number | null
          overall_profit_percentage: number | null
          win_percentage: number | null
          loss_percentage: number | null
          number_of_trades: number | null
          max_drawdown: number | null
          max_drawdown_percentage: number | null
          reward_to_risk_ratio: number | null
          return_max_dd: number | null
          avg_profit_per_trade: number | null
          drawdown_duration: string | null
          created_at: string
          updated_at: string
        }
      }
    }
    Functions: {
      execute_sql: {
        Args: {
          query: string
        }
        Returns: Json
      }
      force_strategy_paid_status: {
        Args: {
          p_user_id: string
          p_strategy_id: number
          p_strategy_name: string
          p_strategy_description: string
        }
        Returns: void
      }
    }
    Enums: {
      // Define your enums here if needed
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          id: string
          name: string
          public: boolean
        }
        Insert: {
          id: string
          name: string
          public?: boolean
        }
        Update: {
          id?: string
          name?: string
          public?: boolean
        }
      }
      objects: {
        Row: {
          bucket_id: string
          name: string
          size: number
          metadata: Json
        }
      }
    }
  }
}
