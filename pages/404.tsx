import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundElements from "@/components/ui/background-elements";

const NotFound = () => {
  const router = useRouter();
  const [errorCode, setErrorCode] = useState("404");

  useEffect(() => {
    const scrambleCodes = ["E-4", "40-4", "ER-404", "SYS-404", "404"];
    let index = 0;

    const interval = setInterval(() => {
      setErrorCode(scrambleCodes[index]);
      index++;

      if (index >= scrambleCodes.length) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Agentic Flow | Page Not Found</title>
        <meta
          name="description"
          content="The requested page could not be found"
        />
      </Head>

      {/*==================== Container ====================*/}
      <div className="flex min-h-screen w-screen items-center justify-center">
        <BackgroundElements />

        {/*==================== Main Content ====================*/}
        <main className=" flex-col justify-center relative z-10 w-full max-w-lg py-8 mx-auto text-center">
          {/*==================== 404 Message ====================*/}
          <div className="mb-6">
            <h1 className="text-8xl sm:text-9xl w-full md:text-[7.5rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">
              {errorCode}
            </h1>
          </div>
          {/*==================== End of 404 Message ====================*/}

          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-foreground">
              Neural Pathway Not Found
            </h2>
            <p className="text-muted-foreground mx-auto">
              The AI agent couldn{"'"}t locate the requested resource in its
              neural network.
              <br />
            </p>

            {/*==================== Terminal-style box - responsive ====================*/}
            <div className="mt-6 p-3 sm:p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg text-left mx-auto max-w-sm sm:max-w-md">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-2" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 mr-2" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-2" />
                <span className="text-xs text-slate-400">
                  terminal@agentic-flow
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm text-green-400">
                <p className="mb-1">
                  <span className="text-blue-400">system:~$</span> Error: Page
                  not found
                </p>
                <p className="mb-1">
                  <span className="text-blue-400">system:~$</span> Attempting to
                  Neural pathway unavailable. Please use navigation options
                  below.
                </p>
                <p>
                  <span className="text-blue-400">system:~$</span>{" "}
                  <span className="animate-ping inline-block w-2 h-4 bg-green-400">
                    .
                  </span>
                </p>
              </div>
            </div>
            {/*==================== End of Terminal-style box - responsive ====================*/}
          </div>

          {/*==================== Responsive button layout ====================*/}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto sm:min-w-[120px] gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto sm:min-w-[120px] gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
          {/*==================== End of Responsive button layout ====================*/}
        </main>
        {/*==================== End of Main Content ====================*/}
      </div>
      {/*==================== End of Container ====================*/}
    </>
  );
};

export default NotFound;
