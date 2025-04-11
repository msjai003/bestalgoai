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
      apexflow_metrics: {
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
      apexflow_strategy: {
        Row: {
          apr: number | null
          aug: number | null
          dec: number | null
          feb: number | null
          id: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
      basic_quiz: {
        Row: {
          correct_answer: string
          created_at: string
          display_order: number
          id: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          display_order?: number
          id?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          display_order?: number
          id?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      basics_question_answers: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          display_order?: number
          id?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: number
          question?: string
          updated_at?: string
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
      broker_image: {
        Row: {
          broker_id: number
          created_at: string
          id: number
          image_url: string
          updated_at: string
        }
        Insert: {
          broker_id: number
          created_at?: string
          id?: number
          image_url: string
          updated_at?: string
        }
        Update: {
          broker_id?: number
          created_at?: string
          id?: number
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      broker_infocap: {
        Row: {
          broker_id: number
          broker_image: string | null
          broker_name: string
          created_at: string
          function_description: string | null
          function_enabled: boolean
          function_name: string
          function_order: number
          function_slug: string
          id: number
          is_premium: boolean
          updated_at: string
        }
        Insert: {
          broker_id: number
          broker_image?: string | null
          broker_name: string
          created_at?: string
          function_description?: string | null
          function_enabled?: boolean
          function_name: string
          function_order?: number
          function_slug: string
          id?: number
          is_premium?: boolean
          updated_at?: string
        }
        Update: {
          broker_id?: number
          broker_image?: string | null
          broker_name?: string
          created_at?: string
          function_description?: string | null
          function_enabled?: boolean
          function_name?: string
          function_order?: number
          function_slug?: string
          id?: number
          is_premium?: boolean
          updated_at?: string
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
          description: string
          id: number
          image: string
          level: string
          name: string
          unlocked_by: string
        }
        Insert: {
          badge_id: string
          description: string
          id?: number
          image: string
          level: string
          name: string
          unlocked_by: string
        }
        Update: {
          badge_id?: string
          description?: string
          id?: number
          image?: string
          level?: string
          name?: string
          unlocked_by?: string
        }
        Relationships: []
      }
      evercrest_metrics: {
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
      evercrest_strategy: {
        Row: {
          apr: number | null
          aug: number | null
          dec: number | null
          feb: number | null
          id: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
      intermediate_questions_answers: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          display_order?: number
          id?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      intermediate_quiz: {
        Row: {
          correct_answer: string
          created_at: string
          display_order: number
          id: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          display_order?: number
          id?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          display_order?: number
          id?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      novaglide_metrics: {
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
      novaglide_strategy: {
        Row: {
          apr: number | null
          aug: number | null
          dec: number | null
          feb: number | null
          id: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
      pro_questions_answers: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          display_order?: number
          id?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      pro_quiz: {
        Row: {
          correct_answer: string
          created_at: string
          display_order: number
          id: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          display_order?: number
          id?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          display_order?: number
          id?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
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
      sms_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          mobile_number: string
          response: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          mobile_number: string
          response?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          mobile_number?: string
          response?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
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
      user_api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          is_active: boolean
          last_used: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_used?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_used?: string | null
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
      velox_edge_metrics: {
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
      velox_edge_strategy: {
        Row: {
          apr: number | null
          aug: number | null
          dec: number | null
          feb: number | null
          id: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          dec: number | null
          feb: number | null
          id: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
          dec?: number | null
          feb?: number | null
          id?: number
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
      execute_sql: {
        Args: { query: string }
        Returns: Json
      }
      force_strategy_paid_status: {
        Args: {
          p_user_id: string
          p_strategy_id: number
          p_strategy_name: string
          p_strategy_description: string
        }
        Returns: undefined
      }
      get_all_broker_infocap_functions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          broker_id: number
          broker_name: string
          function_name: string
          function_description: string
          function_slug: string
          function_enabled: boolean
          is_premium: boolean
          function_order: number
          created_at: string
          updated_at: string
        }[]
      }
      get_all_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          schema: string
          row_count: number
        }[]
      }
      get_broker_image: {
        Args: { p_broker_id: number }
        Returns: string
      }
      get_broker_image_url: {
        Args: { p_broker_id: number }
        Returns: string
      }
      get_broker_infocap_functions: {
        Args: { p_broker_id: number }
        Returns: {
          id: string
          broker_id: number
          broker_name: string
          function_name: string
          function_description: string
          function_slug: string
          function_enabled: boolean
          is_premium: boolean
          function_order: number
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      save_broker_infocap_function: {
        Args: {
          p_broker_id: number
          p_broker_name: string
          p_function_name: string
          p_function_description: string
          p_function_slug: string
          p_function_order: number
          p_function_enabled: boolean
          p_is_premium: boolean
        }
        Returns: number
      }
      sync_brokers_to_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_broker_logo: {
        Args: { p_broker_id: number; p_logo_image: string }
        Returns: undefined
      }
      upsert_broker_image: {
        Args: { p_broker_id: number; p_image_url: string }
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
