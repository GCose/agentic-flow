import React, { useState, useEffect } from "react";
import { User, Shield, Bell, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/contexts/auth-context";

const ClientSettingsPage = () => {
  const { user, updateProfile, updateUser, isImpersonating, stopImpersonation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [organizationName, setOrganizationName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSetupPassword, setShowSetupPassword] = useState(!user?.password);
  const [setupEmailStatus, setSetupEmailStatus] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(user?.notificationEnabled ?? true);

  useEffect(() => {
    if (user) {
      setNotificationEnabled(user.notificationEnabled ?? true);
    }
  }, [user]);
  const [focusField, setFocusField] = useState<string | null>(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = async (section: string) => {
    setIsLoading(true);
    setFeedback(null);
  try {
      if (section === "profile") {
        // Require current password for email change
        if (email !== user?.email && !currentPassword) {
          setFeedback({ type: "error", message: "Current password required to change email." });
          setFocusField("current-password");
          setIsLoading(false);
          return;
        }
        await updateProfile({ name: organizationName, email, currentPassword });
        setFeedback({ type: "success", message: "Profile updated successfully." });
        if (user) {
          updateUser({
            id: user.id,
            name: organizationName,
            email,
            role: user.role,
            avatar: user.avatar || "",
          });
        }
      }
      if (section === "notifications") {
        // Save notificationEnabled to backend
        await updateProfile({ notificationEnabled });
        setFeedback({ type: "success", message: "Notification preferences updated." });
        if (user) {
          updateUser({
            ...user,
            notificationEnabled,
          });
        }
      }
      if (section === "security") {
        if (showSetupPassword) {
          // Setup password for first time
          const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
          if (!strongRegex.test(newPassword)) {
            setFeedback({ type: "error", message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol." });
            setFocusField("new-password");
            setIsLoading(false);
            return;
          }
          if (newPassword !== confirmPassword) {
            setFeedback({ type: "error", message: "Passwords do not match." });
            setFocusField("confirm-password");
            setIsLoading(false);
            return;
          }
          // Call setup-password API
          try {
            const res = await fetch("/api/auth/setup-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: user?.setupToken, password: newPassword })
            });
            const result = await res.json();
            if (res.ok) {
              setFeedback({ type: "success", message: "Password set successfully!" });
              setShowSetupPassword(false);
            } else {
              setFeedback({ type: "error", message: result.error || "Failed to set password." });
            }
          } catch (err) {
            setFeedback({ type: "error", message: "Failed to set password." });
            console.error(err);
          }
          setIsLoading(false);
          return;
        } else {
          // Password change flow
          const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
          if (!strongRegex.test(newPassword)) {
            setFeedback({ type: "error", message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol." });
            setFocusField("new-password");
            setIsLoading(false);
            return;
          }
          if (newPassword !== confirmPassword) {
            setFeedback({ type: "error", message: "Passwords do not match." });
            setFocusField("confirm-password");
            setIsLoading(false);
            return;
          }
          await updateProfile({ password: newPassword, currentPassword });
          setFeedback({ type: "success", message: "Password updated successfully." });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Update failed." });
    }
    setIsLoading(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card className="border-none bg-transparent" role="form" aria-label="Profile Settings">
            <CardHeader>
              <CardTitle className="text-xl text-white">Profile Settings</CardTitle>
              <p className="text-slate-300">Manage your organization profile and account information.</p>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {feedback && (
                <div role="alert" aria-live="assertive" className={`mb-4 text-sm ${feedback.type === "error" ? "text-red-500" : "text-green-500"}`}>{feedback.message}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-white">Organization Name</Label>
                <Input
                  id="org-name"
                  aria-label="Organization Name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="Enter your organization name"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="your@email.com"
                  type="email"
                  tabIndex={0}
                />
              </div>
              {email !== user?.email && (
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-white">Current Password</Label>
                  <Input
                    id="current-password"
                    aria-label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-transparent border-blue-900/70 text-gray-50/70"
                    placeholder="Enter current password to change email"
                    autoFocus={focusField === "current-password"}
                    tabIndex={0}
                  />
                </div>
              )}
              <Button
                onClick={() => handleSave("profile")}
                disabled={isLoading || !organizationName || !email || (email !== user?.email && !currentPassword)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                aria-disabled={isLoading || !organizationName || !email || (email !== user?.email && !currentPassword)}
                tabIndex={0}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );

      case "security":
        return (
          <Card className="border-none bg-transparent" role="form" aria-label="Security Settings">
            <CardHeader>
              <CardTitle className="text-xl text-white">Security Settings</CardTitle>
              <p className="text-slate-300">Update your password and security preferences.</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {feedback && (
                <div role="alert" aria-live="assertive" className={`mb-4 text-sm ${feedback.type === "error" ? "text-red-500" : "text-green-500"}`}>{feedback.message}</div>
              )}
              {showSetupPassword ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-white">Set Password</Label>
                    <Input
                      id="new-password"
                      aria-label="Set Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-transparent border-blue-900/70 text-gray-50/70"
                      placeholder="Enter new password"
                      autoFocus={focusField === "new-password"}
                      tabIndex={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      aria-label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent border-blue-900/70 text-gray-50/70"
                      placeholder="Confirm new password"
                      autoFocus={focusField === "confirm-password"}
                      tabIndex={0}
                    />
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-slate-400 mb-4">Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.</p>
                    <Button
                      onClick={() => handleSave("security")}
                      disabled={isLoading || !newPassword || !confirmPassword}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      aria-disabled={isLoading || !newPassword || !confirmPassword}
                      tabIndex={0}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          Setting Password...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Set Password
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="text-blue-700 border-blue-700"
                      onClick={async () => {
                        setSetupEmailStatus(null);
                        try {
                          const res = await fetch("/api/clients/resend-welcome", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: user?.email })
                          });
                          const result = await res.json();
                          if (res.ok) {
                            setSetupEmailStatus("Setup link resent to your email.");
                          } else {
                            setSetupEmailStatus(result.error || "Failed to resend setup link.");
                          }
                        } catch {
                          setSetupEmailStatus("Failed to resend setup link.");
                        }
                      }}
                    >Resend Setup Link</Button>
                    {setupEmailStatus && (
                      <div className="mt-2 text-sm text-blue-400">{setupEmailStatus}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-white">Current Password</Label>
                    <Input
                      id="current-password"
                      aria-label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-transparent border-blue-900/70 text-gray-50/70"
                      placeholder="Enter current password"
                      autoFocus={focusField === "current-password"}
                      tabIndex={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-white">New Password</Label>
                    <Input
                      id="new-password"
                      aria-label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-transparent border-blue-900/70 text-gray-50/70"
                      placeholder="Enter new password"
                      autoFocus={focusField === "new-password"}
                      tabIndex={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      aria-label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent border-blue-900/70 text-gray-50/70"
                      placeholder="Confirm new password"
                      autoFocus={focusField === "confirm-password"}
                      tabIndex={0}
                    />
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-slate-400 mb-4">Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.</p>
                    <Button
                      onClick={() => handleSave("security")}
                      disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      aria-disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                      tabIndex={0}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-xl text-white">Notification Settings</CardTitle>
              <p className="text-slate-300">Control how you receive notifications from Agentic Flow.</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <h4 className="text-white font-medium text-lg">Enable In-App Notifications</h4>
                    <p className="text-sm text-slate-400">Turn in-app notifications on or off for your account.</p>
                  </div>
                  <Switch
                    checked={notificationEnabled}
                    onCheckedChange={setNotificationEnabled}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <h4 className="text-white font-medium text-lg">Enable Email Notifications</h4>
                    <p className="text-sm text-slate-400">Receive notifications via email.</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSave("notifications")}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      role="client"
      meta={{
        title: "Agentic Flow | Settings",
        description: "Manage your account settings",
      }}
    >
      {isImpersonating && (
        <div className="w-full flex justify-end pt-4 pb-2">
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-500 shadow-lg hover:from-blue-800 hover:to-indigo-600 transition-all duration-200 border-0"
            onClick={stopImpersonation}
          >
            Return to Admin View
          </Button>
        </div>
      )}
      <DashboardHeader role="client" title="Settings" hasBackButton={false} />

      <div className="flex flex-1 h-full py-8">
        {/*==================== Sidebar ====================*/}
        <div className="w-64 border-r border-blue-900/70 bg-transparent p-6">
          <nav className="space-y-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors border-b border-blue-900/70 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-slate-300 hover:bg-gradient-to-r hover:from-blue-800/30 hover:via-blue-700/20 hover:to-blue-500/25 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        {/*==================== End of Sidebar ====================*/}

        {/*==================== Main Content ====================*/}
        <div className="flex-1 px-8">
          {renderTabContent()}
        </div>
        {/*==================== End of Main Content ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default ClientSettingsPage;
