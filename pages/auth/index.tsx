import { useState } from "react";
// import { NextApiRequest, NextPage } from "next";
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
// import { loggedInUser } from "@/utils/auth";

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

      <div className="flex min-h-screen w-screen items-center justify-center">
        <BackgroundElements />

        <Card className="w-full max-w-md border bg-transparent backdrop-blur-md z-10">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
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
            <CardTitle className="text-2xl text-center">Agentic Flow</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  value={email}
                  placeholder="your@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    required
                    id="password"
                    value={password}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3"
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
                <div className="text-sm text-destructive text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center flex flex-col gap-2 text-xs text-muted-foreground">
                <p>Use the following demo credentials:</p>
                <p className="mt-1">Admin: admin@example.com / admin123</p>
                <p>Videographer: video@example.com / video123</p>
                <p>Designer: design@example.com / design123</p>
                <p>Client: client@example.com / client123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;

// export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
//   console.log(req);

//   const user = loggedInUser();

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/auth",
//         permanent: false
//       }
//     }
//   }
//   return {
//     redirect: {
//       destination: "/admin",
//       permanent: false,
//     },
//   };
// };
