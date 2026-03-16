// 📁 파일 경로: app/(public)/donation/page.tsx
"use client";

import { useState } from "react";
import { Heart, CreditCard, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/common/PageHeader";

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000, 300000];

export default function DonationPage() {
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseInt(value.replace(/,/g, ""));
    setAmount(isNaN(parsed) ? 0 : parsed);
  };

  const handleDonate = async () => {
    if (!amount || amount < 1000) {
      alert("최소 후원금은 1,000원입니다.");
      return;
    }
    if (!donorName || !donorEmail) {
      alert("후원자 정보를 입력해주세요.");
      return;
    }
    // 토스페이먼츠 결제 연동 (실제 구현 시 SDK 호출)
    alert(
      `토스페이먼츠 결제 연동 예정\n금액: ${amount.toLocaleString()}원\n${isRecurring ? "정기 후원" : "일시 후원"}`
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="후원하기"
        description="여러분의 소중한 후원이 평화의 씨앗이 됩니다."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[var(--color-accent)]" />
            후원 금액 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 금액 프리셋 */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset ? "default" : "outline"}
                onClick={() => handleAmountSelect(preset)}
              >
                {preset.toLocaleString()}원
              </Button>
            ))}
          </div>

          {/* 직접 입력 */}
          <div className="space-y-2">
            <Label htmlFor="customAmount">직접 입력</Label>
            <div className="flex items-center gap-2">
              <Input
                id="customAmount"
                type="text"
                placeholder="금액을 입력하세요"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
              <span className="text-[var(--color-text-secondary)]">원</span>
            </div>
          </div>

          {/* 정기/일시 후원 */}
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-4">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="font-medium">정기 후원</span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                (매월 자동 결제)
              </span>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>

          {/* 후원자 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donorName">이름</Label>
              <Input
                id="donorName"
                placeholder="이름을 입력하세요"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donorEmail">이메일</Label>
              <Input
                id="donorEmail"
                type="email"
                placeholder="이메일을 입력하세요"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
              />
            </div>
          </div>

          {/* 결제 버튼 */}
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleDonate}
            disabled={!amount || amount < 1000}
          >
            <CreditCard className="h-5 w-5" />
            {amount > 0
              ? `${amount.toLocaleString()}원 후원하기`
              : "금액을 선택해주세요"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
