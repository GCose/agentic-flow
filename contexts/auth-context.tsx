import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demonstration
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "video@example.com",
    password: "video123",
    name: "Video Producer",
    role: "videographer",
  },
  {
    id: "3",
    email: "design@example.com",
    password: "design123",
    name: "Graphic Designer",
    role: "designer",
  },
  {
    id: "4",
    email: "client@example.com",
    password: "client123",
    name: "Client User",
    role: "client",
  },
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("agentic_flow_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("agentic_flow_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const matchedUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!matchedUser) {
        throw new Error("Invalid credentials");
      }

      // Sanitized user object (without password)
      const authenticatedUser: User = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      };

      // Store in context and localStorage
      setUser(authenticatedUser);
      localStorage.setItem(
        "agentic_flow_user",
        JSON.stringify(authenticatedUser)
      );

      // Redirect based on role
      if (authenticatedUser.role === "admin") {
        router.push("/admin");
      } else if (authenticatedUser.role === "videographer") {
        router.push("/videographer");
      } else if (authenticatedUser.role === "designer") {
        router.push("/designer");
      } else if (authenticatedUser.role === "client") {
        router.push("/client");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agentic_flow_user");
    router.push("/auth/");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
