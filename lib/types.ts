import type { Database } from "@/lib/supabase/database.types";

export type VocabItem = Database["public"]["Tables"]["vocab_items"]["Row"];
