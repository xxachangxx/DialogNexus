import { Message } from "../types/message";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <ScrollArea className="h-2/3 p-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={cn(
              "max-w-[80%] w-fit",
              message.role === "user" ? "ml-auto bg-primary/10" : "bg-muted"
            )}
          >
            <CardContent className="p-3">{message.content}</CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatBox;
