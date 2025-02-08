
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OTPInput } from "@/components/ui/input-otp";

const TwoFactorAuth = () => {
  const [enabled, setEnabled] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggle2FA = () => {
    // This is a placeholder for 2FA implementation
    setEnabled(!enabled);
    toast({
      title: enabled ? "2FA Disabled" : "2FA Enabled",
      description: enabled 
        ? "Two-factor authentication has been disabled" 
        : "Two-factor authentication has been enabled",
    });
  };

  const handleVerify = () => {
    if (code.length === 6) {
      toast({
        title: "Success",
        description: "Two-factor authentication verified successfully",
      });
      navigate('/settings');
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
              </p>
              {!enabled ? (
                <Button onClick={handleToggle2FA}>Enable 2FA</Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Enter verification code</p>
                    <OTPInput
                      maxLength={6}
                      value={code}
                      onChange={(value) => setCode(value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleVerify}>Verify</Button>
                    <Button variant="outline" onClick={handleToggle2FA}>
                      Disable 2FA
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TwoFactorAuth;
