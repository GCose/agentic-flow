import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successful. You may now log in.");
      } else {
        setMessage(data.error || "Failed to reset password.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout meta={{ title: "Reset Password" }}>
      <DashboardHeader title="Reset Password" />
      <div className="flex-1 p-4 py-2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Set a new password</h2>
          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mb-4"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          {message && <div className="mt-4 text-center text-sm text-blue-700">{message}</div>}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ResetPasswordPage;
