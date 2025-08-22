import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-store';

const UnauthorizedPage: NextPage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <Head>
        <title>Unauthorized | Agentic Flow</title>
      </Head>
      
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-8 max-w-md">
            You don't have permission to access this resource. 
            Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="space-x-4">
            <Link 
              href="/auth" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white inline-block"
            >
              Go to Login
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
