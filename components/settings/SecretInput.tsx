// 📁 파일 경로: components/settings/SecretInput.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SecretInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maskedValue?: string;
  showCopyButton?: boolean;
}

export default function SecretInput({
  value,
  onChange,
  placeholder = "API Key를 입력하세요",
  disabled = false,
  className,
  maskedValue,
  showCopyButton = false,
}: SecretInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 마스킹된 값이 있으면 그것을 표시 (수정 모드에서 기존 키 표시용)
  const displayValue = maskedValue && !value ? maskedValue : value;

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={maskedValue || placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setIsVisible(!isVisible)}
          tabIndex={-1}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4 text-[var(--color-text-secondary)]" />
          ) : (
            <Eye className="h-4 w-4 text-[var(--color-text-secondary)]" />
          )}
        </Button>
      </div>
      {showCopyButton && displayValue && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopy}
          title="복사"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[var(--color-success)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
