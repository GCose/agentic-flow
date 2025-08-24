import React, { useState } from "react";
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = async (section: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log(`Saved ${section} settings`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Profile Settings
              </CardTitle>
              <p className="text-slate-300">
                Manage your organization profile and account information.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-white">
                  Organization Name
                </Label>
                <Input
                  id="org-name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-white"
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-white"
                  placeholder="your@email.com"
                  type="email"
                />
              </div>

              <Button
                onClick={() => handleSave("profile")}
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
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Security Settings
              </CardTitle>
              <p className="text-slate-300">
                Update your password and security preferences.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-white"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-white"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-white"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-slate-400 mb-4">
                  Password must be at least 8 characters long and include
                  uppercase, lowercase, and numbers.
                </p>
                <Button
                  onClick={() => handleSave("security")}
                  disabled={
                    isLoading ||
                    !currentPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Notification Settings
              </CardTitle>
              <p className="text-slate-300">
                Control how you receive notifications from Agentic Flow.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <h4 className="text-white font-medium text-lg">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-slate-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between py-4 border-t border-blue-900/30">
                  <div className="space-y-1">
                    <h4 className="text-white font-medium text-lg">
                      In-App Notifications
                    </h4>
                    <p className="text-sm text-slate-400">
                      Receive notifications within the application
                    </p>
                  </div>
                  <Switch
                    checked={inAppNotifications}
                    onCheckedChange={setInAppNotifications}
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
      meta={{ title: "Settings", description: "Manage your account settings" }}
    >
      <DashboardHeader role="client" title="Settings" hasBackButton={false} />

      <div className="flex flex-1 h-full py-8">
        {/*==================== Sidebar ====================*/}
        <div className="w-64 border-r border-blue-900/70 bg-transparent p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:bg-blue-600/10 hover:text-blue-300"
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
        <div className="flex-1 px-8">{renderTabContent()}</div>
        {/*==================== End of Main Content ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default ClientSettingsPage;
