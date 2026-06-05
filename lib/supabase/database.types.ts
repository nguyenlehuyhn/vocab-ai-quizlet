export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      vocab_items: {
        Row: {
          id: string;
          user_id: string;
          word: string;
          normalized_word: string;
          vietnamese_meaning: string | null;
          english_example: string | null;
          quizlet_term: string | null;
          quizlet_definition: string | null;
          is_starred: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word: string;
          normalized_word: string;
          vietnamese_meaning?: string | null;
          english_example?: string | null;
          quizlet_term?: string | null;
          quizlet_definition?: string | null;
          is_starred?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word?: string;
          normalized_word?: string;
          vietnamese_meaning?: string | null;
          english_example?: string | null;
          quizlet_term?: string | null;
          quizlet_definition?: string | null;
          is_starred?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vocab_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
