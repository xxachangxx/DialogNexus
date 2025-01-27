import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"

interface InputAreaProps {
  value: string;
  onChange: (text: string) => void;
  onEdit: () => void;
  onClear: () => void;
  onSend: () => void;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ 
  value, 
  onChange, 
  onEdit, 
  onClear, 
  onSend,
  disabled = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        if (!disabled) {
          onSend();
        }
    } else if (e.ctrlKey && e.key === 'l') {
        onClear();
    }}

  return (
    <div className="flex flex-row h-[150px] p-2.5 gap-2.5 items-center border-t-2 border-t-gray-200">
      <Textarea
        id="message-input"
        className='resize-none'
        placeholder="Type Your Message here"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <Button
        variant="outline"
        onClick={onEdit}
        className="w-20 hover:bg-gray-100 hover:text-gray-900 transition-colors [&:active]:scale-95 [&:active]:bg-gray-200 duration-100"
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="secondary"
        onClick={onClear}
        className="w-20 hover:bg-gray-300 hover:scale-105 transition-all [&:active]:scale-95 [&:active]:bg-gray-400 duration-100"
        disabled={disabled}
      >
        Clear
      </Button>
      <Button
        onClick={onSend}
        className="w-20 hover:bg-gray-800 hover:scale-105 transition-all [&:active]:scale-95 [&:active]:bg-gray-900 duration-100"
        disabled={disabled}
      >
        Send
      </Button>
    </div>
  );
};

export default InputArea;