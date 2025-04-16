import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <SidebarProvider>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
