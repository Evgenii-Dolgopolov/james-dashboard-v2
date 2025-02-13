// src/services/messages/transform.ts
import { Message } from "@/lib/supabase/queries"

export function transformMessages(data: any[]): Message[] {
  return data.map(message => ({
    id: message.id,
    created_at: message.created_at,
    bot_id: message.typebot_id || message.bot_id,
    thread_id: message.thread_id,
    user_message: message.user_message,
    bot_message: message.bot_message,
    user_email: message.user_email,
    suggested_question: message.suggested_message,
    sentiment_analysis: message.sentiment_analysis,
    sentiment_analysis_prompt: message.sentiment_analysis_prompt,
    chat_history: message.chat_history,
  }))
}
