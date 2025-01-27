import { ClientDisplayMessage } from "../types/message";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/tailwind-utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ChatBoxProps {
  messages: ClientDisplayMessage[];
}

const roleStyles: Record<string, string> = {
  user: "ml-auto bg-primary/10",
  system: "ml-auto bg-yellow-50 border-2 border-yellow-200 shadow-lg",
  assistant: "bg-white border border-gray-200",
  default: "bg-muted",
};

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <ScrollArea className="h-2/3 p-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => {
          const messageStyle = roleStyles[message.role] || roleStyles.default;

          return (
            <Card key={message.id} className={cn("max-w-[80%] w-fit", messageStyle)}>
              <CardContent
                className={cn(
                  "p-3",
                  message.role === "system" && "font-medium"
                )}
              >
                {message.role === "system" && (
                  <div className="text-xs text-yellow-600 mb-1">System</div>
                )}
                {message.content}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ChatBox;
