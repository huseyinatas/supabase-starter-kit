export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      offers: {
        Row: {
          address: string | null;
          created_at: string;
          daskPoliceNo: string | null;
          definitions: Json | null;
          end_date: string | null;
          guarantee: string | null;
          id: string;
          name_surname: string | null;
          order_token: string | null;
          paid_amount: string | null;
          policeNo: string | null;
          policy_number: string | null;
          start_date: string | null;
          status: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          daskPoliceNo?: string | null;
          definitions?: Json | null;
          end_date?: string | null;
          guarantee?: string | null;
          id?: string;
          name_surname?: string | null;
          order_token?: string | null;
          paid_amount?: string | null;
          policeNo?: string | null;
          policy_number?: string | null;
          start_date?: string | null;
          status?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          daskPoliceNo?: string | null;
          definitions?: Json | null;
          end_date?: string | null;
          guarantee?: string | null;
          id?: string;
          name_surname?: string | null;
          order_token?: string | null;
          paid_amount?: string | null;
          policeNo?: string | null;
          policy_number?: string | null;
          start_date?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          created_at: string | null;
          creator: string | null;
          definitions: Json | null;
          id: string;
          name: string | null;
          status: Database["public"]["Enums"]["active_inactive_status"] | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          creator?: string | null;
          definitions?: Json | null;
          id?: string;
          name?: string | null;
          status?: Database["public"]["Enums"]["active_inactive_status"] | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          creator?: string | null;
          definitions?: Json | null;
          id?: string;
          name?: string | null;
          status?: Database["public"]["Enums"]["active_inactive_status"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_organizations_creator_fkey";
            columns: ["creator"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      permissions: {
        Row: {
          code: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          role: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          role: string;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_permissions_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          creator: string | null;
          definitions: Json | null;
          deleted_at: string | null;
          display_name: string | null;
          email: string | null;
          id: string;
          last_login: Json | null;
          organization: string | null;
          preferences: Json | null;
          profile_photo: string | null;
          role: string | null;
          status: Database["public"]["Enums"]["active_inactive_status"] | null;
          team: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          creator?: string | null;
          definitions?: Json | null;
          deleted_at?: string | null;
          display_name?: string | null;
          email?: string | null;
          id: string;
          last_login?: Json | null;
          organization?: string | null;
          preferences?: Json | null;
          profile_photo?: string | null;
          role?: string | null;
          status?: Database["public"]["Enums"]["active_inactive_status"] | null;
          team?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          creator?: string | null;
          definitions?: Json | null;
          deleted_at?: string | null;
          display_name?: string | null;
          email?: string | null;
          id?: string;
          last_login?: Json | null;
          organization?: string | null;
          preferences?: Json | null;
          profile_photo?: string | null;
          role?: string | null;
          status?: Database["public"]["Enums"]["active_inactive_status"] | null;
          team?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_profiles_creator_fkey";
            columns: ["creator"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_profiles_organization_fkey";
            columns: ["organization"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_profiles_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_profiles_team_fkey";
            columns: ["team"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      roles: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          created_at: string;
          creator: string | null;
          definitions: Json | null;
          deleted_at: string | null;
          id: string;
          logo: string | null;
          name: string | null;
          organization: string | null;
          status: Database["public"]["Enums"]["active_inactive_status"] | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          creator?: string | null;
          definitions?: Json | null;
          deleted_at?: string | null;
          id?: string;
          logo?: string | null;
          name?: string | null;
          organization?: string | null;
          status?: Database["public"]["Enums"]["active_inactive_status"] | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          creator?: string | null;
          definitions?: Json | null;
          deleted_at?: string | null;
          id?: string;
          logo?: string | null;
          name?: string | null;
          organization?: string | null;
          status?: Database["public"]["Enums"]["active_inactive_status"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_teams_creator_fkey";
            columns: ["creator"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_teams_organization_fkey";
            columns: ["organization"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      active_inactive_status: "active" | "inactive";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
