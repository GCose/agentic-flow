import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackgroundElements from "@/components/ui/background-elements";
import { NextPage } from "next";

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Autofill setupToken from query param if present
  useEffect(() => {
    if (router.query.token && typeof router.query.token === "string") {
      setSetupToken(router.query.token);
    }
  }, [router.query.token]);

  if (isAuthenticated) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || (!password && !setupToken)) {
      setError("Please enter your email and either password or setup token");
      return;
    }

    setIsLoading(true);
    setError("");

    // Try password login first, then setupToken
    let result;
    if (password) {
      result = await login(email, password);
    } else if (setupToken) {
      // Custom login for setupToken
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, setupToken })
        });
        if (!res.ok) {
          setError("Invalid email or setup token");
        } else {
          const authenticatedUser = await res.json();
          localStorage.setItem("agentic_flow_user", JSON.stringify(authenticatedUser));
          if (authenticatedUser.role === "admin") {
            router.push("/admin");
          } else if (authenticatedUser.role === "client") {
            router.push("/client");
          } else if (authenticatedUser.role === "ai_developer") {
            router.push("/ai-developer");
          } else {
            router.push("/");
          }
        }
      } catch (err) {
        setError("Login failed");
        console.error(err);
      }
    }
    if (result === undefined && !setupToken) {
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Agentic Flow | Login</title>
        <meta name="description" content="Login to Agentic Flow" />
        <link rel="icon" href="/images/Icon.png" />
      </Head>

      <div className="grid min-h-screen w-screen lg:grid-cols-2">
        {/*==================== Left Side - Visual Content ====================*/}
        <div className="relative hidden lg:flex lg:items-center lg:justify-center bg-transparent">
          <BackgroundElements />

          <div className="relative z-10 text-center text-white">
            <div className="mb-8">
              <Image
                width={120}
                height={120}
                className="mx-auto"
                src="/images/Icon.png"
                alt="Agentic Flow Logo"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Agentic Flow</h1>
            <p className="text-xl text-blue-200">Leveraging AI to Boost ROI</p>
          </div>
        </div>
        {/*==================== End of Left Side - Visual Content ====================*/}

        {/*==================== Right Side - Login Form ====================*/}
        <div className="bg-gradient-to-r from-blue-800/10 to-blue-900/10 flex items-center justify-center p-1 md:p-8">
          <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-full">
                  <Image
                    width={200}
                    height={200}
                    alt="ITCA Logo"
                    className="mr-2"
                    src="/images/Icon.png"
                  />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center text-gray-50">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex flex-col gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    required
                    id="email"
                    type="email"
                    value={email}
                    placeholder="your@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-t-0 border-r-0 border-l-0 border-b rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      value={password}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-t-0 border-r-0 border-l-0 border-b rounded-none border-blue-900/70"
                    />
                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3 text-slate-500 hover:text-slate-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setupToken" className="text-gray-300">
                    Setup Token (for passwordless login)
                  </Label>
                  <Input
                    id="setupToken"
                    value={setupToken}
                    placeholder="Paste setup token from email link"
                    onChange={(e) => setSetupToken(e.target.value)}
                    className="border-t-0 border-r-0 border-l-0 border-b rounded-none border-blue-900/70"
                  />
                  <span className="text-xs text-gray-400">Leave password blank to use setup token for login.</span>
                </div>

                {error && (
                  <div className="text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full from-blue-900 via-blue-900 to-blue-500 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center mt-2">
                  <Link href="/forgot-password" className="text-blue-700 hover:underline text-sm">
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/*==================== End of Right Side - Login Form ====================*/}
      </div>
    </>
  );
};

export default LoginPage;
