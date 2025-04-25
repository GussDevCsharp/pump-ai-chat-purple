export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  card_theme?: string | null;
  card_title?: string | null;
  theme_id?: string | null;
}

export interface Message {
  role: 'assistant' | 'user'
  content: string
}

export interface LocalMessage extends Message {
  session_id: string
  created_at: string
}
