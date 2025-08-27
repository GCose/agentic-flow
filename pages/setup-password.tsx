import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Lock, CheckCircle, XCircle } from "lucide-react";

export default function SetupPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!password || !confirmPassword) {
      setFeedback("Please enter and confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/setup-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const result = await res.json();
    setLoading(false);
    if (res.ok) {
      setFeedback("Password set successfully! You can now log in.");
      setTimeout(() => router.push("//auth"), 2000);
    } else {
      setFeedback(result.error || "Failed to set password.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col justify-center border border-blue-200 text-center" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-4">
          <Lock className="h-12 w-12 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Set Your Password</h2>
          <p className="text-blue-600 mb-2">Create a secure password to activate your account.</p>
        </div>
        {feedback && (
          <div className={`mb-4 flex flex-col items-center ${feedback.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.includes('successfully') ? <CheckCircle className="h-6 w-6 mb-1" /> : <XCircle className="h-6 w-6 mb-1" />}
            <span>{feedback}</span>
          </div>
        )}
        <div className="mb-4 text-left relative">
          <label className="block mb-2 font-medium text-blue-700">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 text-gray-900"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Enter new password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-blue-600 hover:text-blue-800"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="mb-6 text-left relative">
          <label className="block mb-2 font-medium text-blue-700">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 text-gray-900"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Confirm new password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-blue-600 hover:text-blue-800"
            tabIndex={-1}
            onClick={() => setShowConfirmPassword((v) => !v)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded font-bold transition-colors duration-150 ${loading ? 'bg-blue-400' : 'bg-blue-700 hover:bg-blue-800'} text-white flex items-center justify-center gap-2`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z" />
              </svg>
              Setting...
            </span>
          ) : (
            <span>Set Password</span>
          )}
        </button>
        <div className="mt-6 text-sm text-gray-500">
            Already have an account? <Link href="/auth" className="text-blue-600 underline">Log in</Link>
        </div>
      </form>
    </div>
  );
}
