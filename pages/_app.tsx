import { Manrope } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/auth-context";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <main className={manrope.className}>
          <Component {...pageProps} />
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
