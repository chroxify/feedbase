export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      changelog: {
        Row: {
          author_id: string;
          content: string | null;
          created_at: string;
          id: string;
          published: boolean;
          slug: string;
          summary: string | null;
          thumbnail: string | null;
          title: string;
          workspace_id: string;
        };
        Insert: {
          author_id: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          published: boolean;
          slug?: string;
          summary?: string | null;
          thumbnail?: string | null;
          title?: string;
          workspace_id: string;
        };
        Update: {
          author_id?: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          published?: boolean;
          slug?: string;
          summary?: string | null;
          thumbnail?: string | null;
          title?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'changelogs_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'changelogs_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      changelog_subscriber: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'changelog_subscribers_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback: {
        Row: {
          comment_count: number;
          content: string;
          created_at: string;
          id: string;
          raw_tags: Json[] | null;
          status: Database['public']['Enums']['status_type'];
          title: string;
          upvoters: string[] | null;
          upvotes: number;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          comment_count?: number;
          content: string;
          created_at?: string;
          id?: string;
          raw_tags?: Json[] | null;
          status?: Database['public']['Enums']['status_type'];
          title: string;
          upvoters?: string[] | null;
          upvotes?: number;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          comment_count?: number;
          content?: string;
          created_at?: string;
          id?: string;
          raw_tags?: Json[] | null;
          status?: Database['public']['Enums']['status_type'];
          title?: string;
          upvoters?: string[] | null;
          upvotes?: number;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback_comment: {
        Row: {
          content: string;
          created_at: string;
          feedback_id: string;
          id: string;
          reply_to_id: string | null;
          upvotes: number;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          feedback_id: string;
          id?: string;
          reply_to_id?: string | null;
          upvotes?: number;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          feedback_id?: string;
          id?: string;
          reply_to_id?: string | null;
          upvotes?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_comments_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_comments_reply_to_id_fkey';
            columns: ['reply_to_id'];
            isOneToOne: false;
            referencedRelation: 'feedback_comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback_tag: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          name: string;
          workspace_id: string;
        };
        Insert: {
          color: string;
          created_at?: string;
          id?: string;
          name: string;
          workspace_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          name?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_tags_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback_upvoter: {
        Row: {
          created_at: string;
          feedback_id: string;
          id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          feedback_id: string;
          id?: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          feedback_id?: string;
          id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_upvoters_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_upvoters_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      notification: {
        Row: {
          comment_id: string | null;
          created_at: string;
          feedback_id: string;
          has_archived: string[] | null;
          id: string;
          initiator_id: string;
          type: Database['public']['Enums']['notification_type'];
          workspace_id: string;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string;
          feedback_id: string;
          has_archived?: string[] | null;
          id?: string;
          initiator_id: string;
          type: Database['public']['Enums']['notification_type'];
          workspace_id: string;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string;
          feedback_id?: string;
          has_archived?: string[] | null;
          id?: string;
          initiator_id?: string;
          type?: Database['public']['Enums']['notification_type'];
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'feedback_comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_initiator_id_fkey';
            columns: ['initiator_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      profile: {
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
          id?: string;
        };
        Update: {
          avatar_url?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      workspace: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      workspace_api_key: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          name: string;
          permission: Database['public']['Enums']['api_token_type'];
          short_token: string;
          token: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          id?: string;
          name: string;
          permission: Database['public']['Enums']['api_token_type'];
          short_token: string;
          token: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          name?: string;
          permission?: Database['public']['Enums']['api_token_type'];
          short_token?: string;
          token?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_api_keys_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_api_keys_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_config: {
        Row: {
          changelog_enabled: boolean;
          changelog_preview_style: string;
          changelog_twitter_handle: string | null;
          created_at: string;
          custom_domain: string | null;
          custom_domain_verified: boolean | null;
          custom_theme_accent: string | null;
          custom_theme_background: string | null;
          custom_theme_border: string | null;
          custom_theme_primary_foreground: string | null;
          custom_theme_root: string | null;
          custom_theme_secondary_background: string | null;
          feedback_allow_anon_upvoting: boolean | null;
          id: string;
          integration_discord_role_id: string | null;
          integration_discord_status: boolean;
          integration_discord_webhook: string | null;
          integration_slack_status: boolean;
          integration_slack_webhook: string | null;
          integration_sso_secret: string | null;
          integration_sso_status: boolean | null;
          integration_sso_url: string | null;
          logo_redirect_url: string | null;
          workspace_icon: string | null;
          workspace_icon_radius: string;
          workspace_id: string;
          workspace_og_image: string | null;
          workspace_theme: Database['public']['Enums']['theme_type'];
        };
        Insert: {
          changelog_enabled?: boolean;
          changelog_preview_style?: string;
          changelog_twitter_handle?: string | null;
          created_at?: string;
          custom_domain?: string | null;
          custom_domain_verified?: boolean | null;
          custom_theme_accent?: string | null;
          custom_theme_background?: string | null;
          custom_theme_border?: string | null;
          custom_theme_primary_foreground?: string | null;
          custom_theme_root?: string | null;
          custom_theme_secondary_background?: string | null;
          feedback_allow_anon_upvoting?: boolean | null;
          id?: string;
          integration_discord_role_id?: string | null;
          integration_discord_status?: boolean;
          integration_discord_webhook?: string | null;
          integration_slack_status?: boolean;
          integration_slack_webhook?: string | null;
          integration_sso_secret?: string | null;
          integration_sso_status?: boolean | null;
          integration_sso_url?: string | null;
          logo_redirect_url?: string | null;
          workspace_icon?: string | null;
          workspace_icon_radius?: string;
          workspace_id: string;
          workspace_og_image?: string | null;
          workspace_theme?: Database['public']['Enums']['theme_type'];
        };
        Update: {
          changelog_enabled?: boolean;
          changelog_preview_style?: string;
          changelog_twitter_handle?: string | null;
          created_at?: string;
          custom_domain?: string | null;
          custom_domain_verified?: boolean | null;
          custom_theme_accent?: string | null;
          custom_theme_background?: string | null;
          custom_theme_border?: string | null;
          custom_theme_primary_foreground?: string | null;
          custom_theme_root?: string | null;
          custom_theme_secondary_background?: string | null;
          feedback_allow_anon_upvoting?: boolean | null;
          id?: string;
          integration_discord_role_id?: string | null;
          integration_discord_status?: boolean;
          integration_discord_webhook?: string | null;
          integration_slack_status?: boolean;
          integration_slack_webhook?: string | null;
          integration_sso_secret?: string | null;
          integration_sso_status?: boolean | null;
          integration_sso_url?: string | null;
          logo_redirect_url?: string | null;
          workspace_icon?: string | null;
          workspace_icon_radius?: string;
          workspace_id?: string;
          workspace_og_image?: string | null;
          workspace_theme?: Database['public']['Enums']['theme_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'project_configs_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_invite: {
        Row: {
          accepted: boolean;
          created_at: string;
          creator_id: string;
          email: string;
          id: string;
          workspace_id: string;
        };
        Insert: {
          accepted?: boolean;
          created_at?: string;
          creator_id: string;
          email: string;
          id?: string;
          workspace_id: string;
        };
        Update: {
          accepted?: boolean;
          created_at?: string;
          creator_id?: string;
          email?: string;
          id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_invites_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_invites_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_member: {
        Row: {
          created_at: string | null;
          id: string;
          member_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          member_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          member_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_members_member_id_fkey';
            columns: ['member_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_members_project_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_allowed_api_token: {
        Args: {
          apitoken: string;
          tokentype: Database['public']['Enums']['api_token_type'][];
        };
        Returns: boolean;
      };
    };
    Enums: {
      api_token_type: 'full_access' | 'public_access';
      icon_radius_type: 'rounded-full' | 'rounded-none' | 'rounded-md';
      notification_type: 'comment' | 'post';
      status_type: 'in review' | 'planned' | 'in progress' | 'completed' | 'rejected';
      theme_type: 'dark' | 'light' | 'custom';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
