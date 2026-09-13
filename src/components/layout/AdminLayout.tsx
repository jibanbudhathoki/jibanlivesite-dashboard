import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthorized(false);
      navigate('/login', { replace: true });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <div className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-900 p-8 shadow-sm border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent mb-4" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Verifying Authorization
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Checking session credentials or redirecting to login...
          </p>
          <a
            href="/login"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Go to Admin Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
