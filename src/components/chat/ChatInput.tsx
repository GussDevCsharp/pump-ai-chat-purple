
import { ChatInputArea } from "./input/ChatInputArea";

interface ChatInputProps {
  suggestedPrompts?: string[];
  onSendMessage: (message: string) => void;
  furtivePromptTitle?: string;
  setFurtivePromptCleared?: () => void;
}

export const ChatInput = (props: ChatInputProps) => {
  return <ChatInputArea {...props} />;
};
