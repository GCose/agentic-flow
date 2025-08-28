import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Head from "next/head";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        setMessage(data.error || "Failed to send reset link.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen w-screen">
        <div className="flex items-center justify-center w-full h-full">
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow-lg flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-4 text-blue-900 text-center">Reset your password</h2>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mb-4 text-blue-900 placeholder-blue-700 bg-white border-gray-300"
              style={{ color: '#1e293b' }}
            />
            <Button type="submit" disabled={loading} className="w-full text-blue-900 bg-blue-100 hover:bg-blue-200">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            {message && <div className="mt-4 text-center text-sm text-blue-700">{message}</div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
