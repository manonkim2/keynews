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
      keyword: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      summaries: {
        Row: {
          article_url: string;
          title: string;
          summary: string;
          created_at: string;
        };
        Insert: {
          article_url: string;
          title: string;
          summary: string;
          created_at?: string;
        };
        Update: {
          article_url?: string;
          title?: string;
          summary?: string;
          created_at?: string;
        };
      };
    };
  };
};
