export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      changelogs: {
        Row: {
          content: string | null;
          id: string;
          image: string | null;
          project_id: string;
          publish_date: string | null;
          published: boolean;
          summary: string | null;
          title: string;
        };
        Insert: {
          content?: string | null;
          id?: string;
          image?: string | null;
          project_id: string;
          publish_date?: string | null;
          published: boolean;
          summary?: string | null;
          title?: string;
        };
        Update: {
          content?: string | null;
          id?: string;
          image?: string | null;
          project_id?: string;
          publish_date?: string | null;
          published?: boolean;
          summary?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'changelogs_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string;
          full_name: string;
          id: string;
        };
        Insert: {
          avatar_url?: string | null;
          email: string;
          full_name: string;
          id: string;
        };
        Update: {
          avatar_url?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      project_members: {
        Row: {
          created_at: string | null;
          id: string;
          member_id: string;
          project_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          member_id: string;
          project_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          member_id?: string;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_members_member_id_fkey';
            columns: ['member_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_members_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
