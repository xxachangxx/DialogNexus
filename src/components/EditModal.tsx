import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface EditModalProps {
  isOpen: boolean;
  onSubmit: (text: string) => void;
  onClose: () => void;
  initialText: string;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  initialText,
}) => {
  const [inputText, setInputText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setInputText(initialText);
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(inputText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[500px] max-w-[90%]">
        <CardHeader>
          <CardTitle>编辑内容</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button onClick={handleSubmit}>确认</Button>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditModal;
