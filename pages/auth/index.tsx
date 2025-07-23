import { useState } from "react";
import Head from "next/head";
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
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      // Redirect handled in auth context
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Agentic Flow | Login</title>
        <meta name="description" content="Login to Agentic Flow" />
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
            <p className="text-xl text-blue-200">
              Streamline your workflow with intelligent automation
            </p>
          </div>
        </div>
        {/*==================== End of Left Side - Visual Content ====================*/}

        {/*==================== Right Side - Login Form ====================*/}
        <div className="flex items-center justify-center p-8 bg-gray-50/5 ">
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
              <CardTitle className="text-2xl text-center text-gray-100">
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
                  <Label htmlFor="email" className="text-gray-400">
                    Email
                  </Label>
                  <Input
                    required
                    id="email"
                    type="email"
                    value={email}
                    placeholder="your@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-400">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      required
                      id="password"
                      value={password}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-300 focus:border-blue-500"
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

                {error && (
                  <div className="text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {/* <div className="text-center flex flex-col gap-2 text-xs text-muted-foreground">
                  <p>Use the following demo credentials:</p>
                  <p className="mt-1">Admin: admin@example.com / admin123</p>
                  <p>Videographer: video@example.com / video123</p>
                  <p>Designer: design@example.com / design123</p>
                  <p>Client: client@example.com / client123</p>
                </div> */}
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
