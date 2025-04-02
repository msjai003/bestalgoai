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
          product_type: string
          secret_key: string | null
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
          product_type?: string
          secret_key?: string | null
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
          product_type?: string
          secret_key?: string | null
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
          broker_username: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          legs: Json
          name: string
          paid_status: string | null
          performance: Json | null
          quantity: number | null
          selected_broker: string | null
          strategy_type: string
          trade_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          broker_username?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          legs: Json
          name: string
          paid_status?: string | null
          performance?: Json | null
          quantity?: number | null
          selected_broker?: string | null
          strategy_type?: string
          trade_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          broker_username?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          legs?: Json
          name?: string
          paid_status?: string | null
          performance?: Json | null
          quantity?: number | null
          selected_broker?: string | null
          strategy_type?: string
          trade_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      education_badges: {
        Row: {
          badge_id: string
          created_at: string | null
          description: string
          id: string
          image: string
          level: string
          name: string
          unlocked_by: string
          updated_at: string | null
        }
        Insert: {
          badge_id: string
          created_at?: string | null
          description: string
          id?: string
          image: string
          level: string
          name: string
          unlocked_by: string
          updated_at?: string | null
        }
        Update: {
          badge_id?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          level?: string
          name?: string
          unlocked_by?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      education_content: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          id: string
          media_url: string | null
          module_id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          media_url?: string | null
          module_id: string
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          media_url?: string | null
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_content_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "education_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      education_modules: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_time: number | null
          id: string
          is_active: boolean | null
          level: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          is_active?: boolean | null
          level: string
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          is_active?: boolean | null
          level?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      education_quiz_answers: {
        Row: {
          answer_text: string
          created_at: string | null
          id: string
          is_correct: boolean
          order_index: number
          question_id: string
          updated_at: string | null
        }
        Insert: {
          answer_text: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          order_index: number
          question_id: string
          updated_at?: string | null
        }
        Update: {
          answer_text?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          order_index?: number
          question_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "education_quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      education_quiz_questions: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string
          module_id: string
          order_index: number
          question: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          module_id: string
          order_index: number
          question: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          module_id?: string
          order_index?: number
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "education_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      google_user_details: {
        Row: {
          created_at: string | null
          email: string
          family_name: string | null
          given_name: string | null
          google_id: string | null
          id: string
          locale: string | null
          picture_url: string | null
          updated_at: string | null
          verified_email: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          family_name?: string | null
          given_name?: string | null
          google_id?: string | null
          id: string
          locale?: string | null
          picture_url?: string | null
          updated_at?: string | null
          verified_email?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          family_name?: string | null
          given_name?: string | null
          google_id?: string | null
          id?: string
          locale?: string | null
          picture_url?: string | null
          updated_at?: string | null
          verified_email?: boolean | null
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
      pnl_logs: {
        Row: {
          alert_time: string | null
          client_id: number | null
          client_name: string | null
          created_at: string | null
          date: string | null
          id: string
          pnl: number | null
          price: number | null
          qty: number | null
          side: string | null
          strategy_id: number | null
          symbol: string | null
        }
        Insert: {
          alert_time?: string | null
          client_id?: number | null
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          pnl?: number | null
          price?: number | null
          qty?: number | null
          side?: string | null
          strategy_id?: number | null
          symbol?: string | null
        }
        Update: {
          alert_time?: string | null
          client_id?: number | null
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          pnl?: number | null
          price?: number | null
          qty?: number | null
          side?: string | null
          strategy_id?: number | null
          symbol?: string | null
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
      trade_alerts: {
        Row: {
          alert_time: string | null
          client_id: number | null
          client_name: string | null
          id: number
          pnl: string | null
          price: number | null
          qty: number | null
          side: string | null
          status: string | null
          symbol: string | null
        }
        Insert: {
          alert_time?: string | null
          client_id?: number | null
          client_name?: string | null
          id?: number
          pnl?: string | null
          price?: number | null
          qty?: number | null
          side?: string | null
          status?: string | null
          symbol?: string | null
        }
        Update: {
          alert_time?: string | null
          client_id?: number | null
          client_name?: string | null
          id?: number
          pnl?: string | null
          price?: number | null
          qty?: number | null
          side?: string | null
          status?: string | null
          symbol?: string | null
        }
        Relationships: []
      }
      user_completed_modules: {
        Row: {
          completed_at: string | null
          id: string
          level: string
          module_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          level: string
          module_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          level?: string
          module_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_earned_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_education_progress: {
        Row: {
          created_at: string | null
          current_card: number
          current_level: string
          current_module: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_card?: number
          current_level?: string
          current_module?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_card?: number
          current_level?: string
          current_module?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_module_views: {
        Row: {
          id: string
          module_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          module_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          module_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          mobile_number: string | null
          profile_picture: string | null
          trading_experience: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          mobile_number?: string | null
          profile_picture?: string | null
          trading_experience?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string | null
          profile_picture?: string | null
          trading_experience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_quiz_results: {
        Row: {
          completed_at: string | null
          id: string
          module_id: string
          passed: boolean
          score: number
          time_spent: number
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          module_id: string
          passed?: boolean
          score: number
          time_spent: number
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          module_id?: string
          passed?: boolean
          score?: number
          time_spent?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      velox_edge_strategy: {
        Row: {
          apr: number | null
          aug: number | null
          created_at: string | null
          dec: number | null
          feb: number | null
          id: string
          jan: number | null
          jul: number | null
          jun: number | null
          mar: number | null
          max_drawdown: number | null
          may: number | null
          nov: number | null
          oct: number | null
          sep: number | null
          total: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          apr?: number | null
          aug?: number | null
          created_at?: string | null
          dec?: number | null
          feb?: number | null
          id?: string
          jan?: number | null
          jul?: number | null
          jun?: number | null
          mar?: number | null
          max_drawdown?: number | null
          may?: number | null
          nov?: number | null
          oct?: number | null
          sep?: number | null
          total?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          apr?: number | null
          aug?: number | null
          created_at?: string | null
          dec?: number | null
          feb?: number | null
          id?: string
          jan?: number | null
          jul?: number | null
          jun?: number | null
          mar?: number | null
          max_drawdown?: number | null
          may?: number | null
          nov?: number | null
          oct?: number | null
          sep?: number | null
          total?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      veloxedge_metrics: {
        Row: {
          avg_loss_on_losing_trades: number
          avg_loss_on_losing_trades_percentage: number
          avg_profit_on_winning_trades: number
          avg_profit_on_winning_trades_percentage: number
          avg_profit_per_trade: number
          avg_profit_per_trade_percentage: number
          created_at: string
          drawdown_duration: string
          expectancy_ratio: number
          id: string
          loss_percentage: number
          max_drawdown: number
          max_drawdown_percentage: number
          max_losing_streak: number
          max_loss_in_single_trade: number
          max_loss_in_single_trade_percentage: number
          max_profit_in_single_trade: number
          max_profit_in_single_trade_percentage: number
          max_trades_in_drawdown: number
          max_win_streak: number
          number_of_trades: number
          overall_profit: number
          overall_profit_percentage: number
          return_max_dd: number
          reward_to_risk_ratio: number
          updated_at: string
          win_percentage: number
        }
        Insert: {
          avg_loss_on_losing_trades: number
          avg_loss_on_losing_trades_percentage: number
          avg_profit_on_winning_trades: number
          avg_profit_on_winning_trades_percentage: number
          avg_profit_per_trade: number
          avg_profit_per_trade_percentage: number
          created_at?: string
          drawdown_duration: string
          expectancy_ratio: number
          id?: string
          loss_percentage: number
          max_drawdown: number
          max_drawdown_percentage: number
          max_losing_streak: number
          max_loss_in_single_trade: number
          max_loss_in_single_trade_percentage: number
          max_profit_in_single_trade: number
          max_profit_in_single_trade_percentage: number
          max_trades_in_drawdown: number
          max_win_streak: number
          number_of_trades: number
          overall_profit: number
          overall_profit_percentage: number
          return_max_dd: number
          reward_to_risk_ratio: number
          updated_at?: string
          win_percentage: number
        }
        Update: {
          avg_loss_on_losing_trades?: number
          avg_loss_on_losing_trades_percentage?: number
          avg_profit_on_winning_trades?: number
          avg_profit_on_winning_trades_percentage?: number
          avg_profit_per_trade?: number
          avg_profit_per_trade_percentage?: number
          created_at?: string
          drawdown_duration?: string
          expectancy_ratio?: number
          id?: string
          loss_percentage?: number
          max_drawdown?: number
          max_drawdown_percentage?: number
          max_losing_streak?: number
          max_loss_in_single_trade?: number
          max_loss_in_single_trade_percentage?: number
          max_profit_in_single_trade?: number
          max_profit_in_single_trade_percentage?: number
          max_trades_in_drawdown?: number
          max_win_streak?: number
          number_of_trades?: number
          overall_profit?: number
          overall_profit_percentage?: number
          return_max_dd?: number
          reward_to_risk_ratio?: number
          updated_at?: string
          win_percentage?: number
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
      zenflow_metrics: {
        Row: {
          avg_loss_on_losing_trades: number | null
          avg_loss_on_losing_trades_percentage: number | null
          avg_profit_on_winning_trades: number | null
          avg_profit_on_winning_trades_percentage: number | null
          avg_profit_per_trade: number | null
          avg_profit_per_trade_percentage: number | null
          created_at: string
          drawdown_duration: string | null
          expectancy_ratio: number | null
          id: string
          loss_percentage: number | null
          max_drawdown: number | null
          max_drawdown_percentage: number | null
          max_losing_streak: number | null
          max_loss_in_single_trade: number | null
          max_loss_in_single_trade_percentage: number | null
          max_profit_in_single_trade: number | null
          max_profit_in_single_trade_percentage: number | null
          max_trades_in_drawdown: number | null
          max_win_streak: number | null
          number_of_trades: number | null
          overall_profit: number | null
          overall_profit_percentage: number | null
          return_max_dd: number | null
          reward_to_risk_ratio: number | null
          updated_at: string
          win_percentage: number | null
        }
        Insert: {
          avg_loss_on_losing_trades?: number | null
          avg_loss_on_losing_trades_percentage?: number | null
          avg_profit_on_winning_trades?: number | null
          avg_profit_on_winning_trades_percentage?: number | null
          avg_profit_per_trade?: number | null
          avg_profit_per_trade_percentage?: number | null
          created_at?: string
          drawdown_duration?: string | null
          expectancy_ratio?: number | null
          id?: string
          loss_percentage?: number | null
          max_drawdown?: number | null
          max_drawdown_percentage?: number | null
          max_losing_streak?: number | null
          max_loss_in_single_trade?: number | null
          max_loss_in_single_trade_percentage?: number | null
          max_profit_in_single_trade?: number | null
          max_profit_in_single_trade_percentage?: number | null
          max_trades_in_drawdown?: number | null
          max_win_streak?: number | null
          number_of_trades?: number | null
          overall_profit?: number | null
          overall_profit_percentage?: number | null
          return_max_dd?: number | null
          reward_to_risk_ratio?: number | null
          updated_at?: string
          win_percentage?: number | null
        }
        Update: {
          avg_loss_on_losing_trades?: number | null
          avg_loss_on_losing_trades_percentage?: number | null
          avg_profit_on_winning_trades?: number | null
          avg_profit_on_winning_trades_percentage?: number | null
          avg_profit_per_trade?: number | null
          avg_profit_per_trade_percentage?: number | null
          created_at?: string
          drawdown_duration?: string | null
          expectancy_ratio?: number | null
          id?: string
          loss_percentage?: number | null
          max_drawdown?: number | null
          max_drawdown_percentage?: number | null
          max_losing_streak?: number | null
          max_loss_in_single_trade?: number | null
          max_loss_in_single_trade_percentage?: number | null
          max_profit_in_single_trade?: number | null
          max_profit_in_single_trade_percentage?: number | null
          max_trades_in_drawdown?: number | null
          max_win_streak?: number | null
          number_of_trades?: number | null
          overall_profit?: number | null
          overall_profit_percentage?: number | null
          return_max_dd?: number | null
          reward_to_risk_ratio?: number | null
          updated_at?: string
          win_percentage?: number | null
        }
        Relationships: []
      }
      zenflow_strategy: {
        Row: {
          apr: number | null
          aug: number | null
          created_at: string | null
          dec: number | null
          feb: number | null
          id: string
          jan: number | null
          jul: number | null
          jun: number | null
          mar: number | null
          max_drawdown: number | null
          may: number | null
          nov: number | null
          oct: number | null
          sep: number | null
          total: number | null
          year: number
        }
        Insert: {
          apr?: number | null
          aug?: number | null
          created_at?: string | null
          dec?: number | null
          feb?: number | null
          id?: string
          jan?: number | null
          jul?: number | null
          jun?: number | null
          mar?: number | null
          max_drawdown?: number | null
          may?: number | null
          nov?: number | null
          oct?: number | null
          sep?: number | null
          total?: number | null
          year: number
        }
        Update: {
          apr?: number | null
          aug?: number | null
          created_at?: string | null
          dec?: number | null
          feb?: number | null
          id?: string
          jan?: number | null
          jul?: number | null
          jun?: number | null
          mar?: number | null
          max_drawdown?: number | null
          may?: number | null
          nov?: number | null
          oct?: number | null
          sep?: number | null
          total?: number | null
          year?: number
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
