// 📁 파일 경로: app/(admin)/settings/general/page.tsx
"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "팍스 크리스티 코리아",
    email: "contact@paxchristikorea.org",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
    donationGoal: "",
  });

  const handleSave = () => {
    // TODO: Server Action으로 설정 저장
    alert("설정이 저장되었습니다.");
  };

  return (
    <div>
      <PageHeader
        title="일반 설정"
        description="사이트 기본 정보를 설정합니다."
      >
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          저장
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">사이트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">사이트명</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">대표 이메일</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">소셜 링크</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/..."
                value={settings.facebook}
                onChange={(e) =>
                  setSettings({ ...settings, facebook: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/..."
                value={settings.instagram}
                onChange={(e) =>
                  setSettings({ ...settings, instagram: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/..."
                value={settings.youtube}
                onChange={(e) =>
                  setSettings({ ...settings, youtube: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">후원 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="donationGoal">후원금 목표액 (원)</Label>
              <Input
                id="donationGoal"
                type="number"
                placeholder="예: 50000000"
                value={settings.donationGoal}
                onChange={(e) =>
                  setSettings({ ...settings, donationGoal: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
