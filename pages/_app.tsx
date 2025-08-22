import { Manrope } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthInitializer } from "@/components/auth-initializer";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthInitializer>
      <SidebarProvider>
        <main className={manrope.className}>
          <Component {...pageProps} />
        </main>
      </SidebarProvider>
    </AuthInitializer>
  );
};

export default App;
