export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_entries: {
        Row: {
          created_at: string
          href: string | null
          id: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          href?: string | null
          id?: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          href?: string | null
          id?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          bio: string
          greeting_arabic: string
          hobbies: string[]
          id: string
          name: string
          og_description: string
          og_image: string | null
          og_title: string
          rank: string
          status: string
          tagline: string
          title: string
          typing_arabic: string
          typing_bangla: string
          updated_at: string
          who_favourite_book: string
          who_focus: string
          who_interests: string[]
          who_personality: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string
          greeting_arabic?: string
          hobbies?: string[]
          id?: string
          name?: string
          og_description?: string
          og_image?: string | null
          og_title?: string
          rank?: string
          status?: string
          tagline?: string
          title?: string
          typing_arabic?: string
          typing_bangla?: string
          updated_at?: string
          who_favourite_book?: string
          who_focus?: string
          who_interests?: string[]
          who_personality?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string
          greeting_arabic?: string
          hobbies?: string[]
          id?: string
          name?: string
          og_description?: string
          og_image?: string | null
          og_title?: string
          rank?: string
          status?: string
          tagline?: string
          title?: string
          typing_arabic?: string
          typing_bangla?: string
          updated_at?: string
          who_favourite_book?: string
          who_focus?: string
          who_interests?: string[]
          who_personality?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_h: number
          accent_l: number
          accent_s: number
          audio_label: string
          audio_url: string | null
          id: string
          updated_at: string
        }
        Insert: {
          accent_h?: number
          accent_l?: number
          accent_s?: number
          audio_label?: string
          audio_url?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          accent_h?: number
          accent_l?: number
          accent_s?: number
          audio_label?: string
          audio_url?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          platform: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      works: {
        Row: {
          category: Database["public"]["Enums"]["work_category"]
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          link_url: string | null
          media_url: string | null
          sort_order: number
          title: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["work_category"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          link_url?: string | null
          media_url?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["work_category"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          link_url?: string | null
          media_url?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      work_category:
        | "website"
        | "app"
        | "graphic"
        | "video"
        | "audio"
        | "other"
        | "ai"
        | "tutorial"
        | "islam"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      work_category: [
        "website",
        "app",
        "graphic",
        "video",
        "audio",
        "other",
        "ai",
        "tutorial",
        "islam",
      ],
    },
  },
} as const
