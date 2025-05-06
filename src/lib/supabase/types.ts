
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
      // Define your tables here if needed
    }
    Views: {
      // Define your views here if needed
    }
    Functions: {
      // Define your functions here if needed
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
