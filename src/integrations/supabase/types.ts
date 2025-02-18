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
      certificates: {
        Row: {
          blockchain_hash: string
          blockchain_timestamp: string
          certificate_number: string
          completion_rate: number | null
          course_description: string | null
          course_name: string
          created_at: string
          diploma_image_url: string | null
          email: string | null
          id: string
          issue_date: string
          last_activity: string | null
          last_login: string | null
          normalized_recipient_name: string | null
          organization: string | null
          organization_id: string | null
          phone: string | null
          provider: string
          provider_description: string | null
          recipient_name: string
          registration_date: string | null
          status: Database["public"]["Enums"]["certificate_status"]
          valid_through: string
          year_of_birth: number
        }
        Insert: {
          blockchain_hash: string
          blockchain_timestamp?: string
          certificate_number: string
          completion_rate?: number | null
          course_description?: string | null
          course_name: string
          created_at?: string
          diploma_image_url?: string | null
          email?: string | null
          id?: string
          issue_date?: string
          last_activity?: string | null
          last_login?: string | null
          normalized_recipient_name?: string | null
          organization?: string | null
          organization_id?: string | null
          phone?: string | null
          provider?: string
          provider_description?: string | null
          recipient_name: string
          registration_date?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          valid_through: string
          year_of_birth: number
        }
        Update: {
          blockchain_hash?: string
          blockchain_timestamp?: string
          certificate_number?: string
          completion_rate?: number | null
          course_description?: string | null
          course_name?: string
          created_at?: string
          diploma_image_url?: string | null
          email?: string | null
          id?: string
          issue_date?: string
          last_activity?: string | null
          last_login?: string | null
          normalized_recipient_name?: string | null
          organization?: string | null
          organization_id?: string | null
          phone?: string | null
          provider?: string
          provider_description?: string | null
          recipient_name?: string
          registration_date?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          valid_through?: string
          year_of_birth?: number
        }
        Relationships: [
          {
            foreignKeyName: "certificates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      enrolled_courses: {
        Row: {
          course_name: string
          created_at: string | null
          id: string
          progress: number | null
          status: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          course_name: string
          created_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          course_name?: string
          created_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrolled_courses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          billing_address: Json
          billing_email: string
          billing_name: string
          created_at: string | null
          id: string
          payment_method: string | null
          status: string
          subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_address: Json
          billing_email: string
          billing_name: string
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status: string
          subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_address?: Json
          billing_email?: string
          billing_name?: string
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_payment_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          plan_id?: string | null
          status: string
          stripe_payment_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          is_popular: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features: Json
          id?: string
          is_popular?: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_popular?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          dark_mode: boolean | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          logo_url: string | null
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          logo_url?: string | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          logo_url?: string | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_attempts: {
        Row: {
          certificate_number: string | null
          created_at: string
          id: string
          ip_address: string
          recipient_name: string | null
          successful: boolean
          year_of_birth: number | null
        }
        Insert: {
          certificate_number?: string | null
          created_at?: string
          id?: string
          ip_address: string
          recipient_name?: string | null
          successful?: boolean
          year_of_birth?: number | null
        }
        Update: {
          certificate_number?: string | null
          created_at?: string
          id?: string
          ip_address?: string
          recipient_name?: string | null
          successful?: boolean
          year_of_birth?: number | null
        }
        Relationships: []
      }
      verification_log: {
        Row: {
          certificate_number: string | null
          created_at: string
          id: string
          ip_address: string
          recipient_name: string | null
          successful: boolean
          year_of_birth: number | null
        }
        Insert: {
          certificate_number?: string | null
          created_at?: string
          id?: string
          ip_address: string
          recipient_name?: string | null
          successful?: boolean
          year_of_birth?: number | null
        }
        Update: {
          certificate_number?: string | null
          created_at?: string
          id?: string
          ip_address?: string
          recipient_name?: string | null
          successful?: boolean
          year_of_birth?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          check_ip: string
        }
        Returns: boolean
      }
      get_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      normalize_name: {
        Args: {
          input_name: string
        }
        Returns: string
      }
      verify_certificate: {
        Args: {
          client_ip: string
          search_certificate_number?: string
          search_recipient_name?: string
          search_year_of_birth?: number
        }
        Returns: {
          certificate_id: string
          certificate_number: string
          recipient_name: string
          course_name: string
          course_description: string
          issue_date: string
          valid_through: string
          status: Database["public"]["Enums"]["certificate_status"]
          provider: string
          provider_description: string
          blockchain_hash: string
          blockchain_timestamp: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      certificate_status: "active" | "expired" | "revoked"
      user_role: "admin" | "instructor" | "student" | "standard"
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
