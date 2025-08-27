import { useState } from "react";
import { useRouter } from "next/router";
import { CheckCircle, MailCheck, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setFeedback(null);
    setSuccess(false);
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setFeedback("Email verified! You can now log in.");
      setTimeout(() => router.push("/auth"), 2000);
    } else {
      setFeedback(result.error || "Verification failed.");
    }
  };

  return (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
  <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-blue-200 flex flex-col justify-center">
        <div className="flex flex-col items-center mb-4">
          <MailCheck className="h-12 w-12 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Verify Your Email</h2>
          <p className="text-blue-600 mb-2">To activate your account, please verify your email address.</p>
        </div>
        {feedback && (
          <div className={`mb-4 flex flex-col items-center ${success ? 'text-green-600' : 'text-red-600'}`}>
            {success ? <CheckCircle className="h-6 w-6 mb-1" /> : <XCircle className="h-6 w-6 mb-1" />}
            <span>{feedback}</span>
          </div>
        )}
        <button
          onClick={handleVerify}
          className={`w-full py-2 rounded font-bold transition-colors duration-150 ${loading ? 'bg-blue-400' : 'bg-blue-700 hover:bg-blue-800'} text-white flex items-center justify-center gap-2`}
          disabled={loading || success}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z" />
              </svg>
              Verifying...
            </span>
          ) : (
            <span>Verify Email</span>
          )}
        </button>
        <div className="mt-6 text-sm text-gray-500">
          Didn&apos;t receive the email? <a href="/auth/resend" className="text-blue-600 underline">Resend</a>
        </div>
      </div>
    </div>
  );
}
