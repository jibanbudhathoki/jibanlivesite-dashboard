import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Mail, Globe, ExternalLink } from 'lucide-react';
import { useMessagesQuery } from '@/src/features/messages/hooks/useMessages';
import { useSettingsQuery } from '@/src/features/settings/hooks/useSettings';

export function Header() {
  const navigate = useNavigate();
  const { data: messagesData } = useMessagesQuery(false);
  const unreadCount = messagesData?.meta?.unread || 0;
  const { data: settings } = useSettingsQuery();
  const liveUrl = settings?.siteUrl?.trim() || "https://jibanbudhathoki.com.np";

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center">
        <button className="md:hidden p-2 text-gray-500 hover:text-gray-700">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Visit Live Website: ${liveUrl}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-700 dark:hover:text-indigo-400 transition-colors"
        >
          <Globe className="h-3.5 w-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Live Site</span>
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </a>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <Link
          to="/messages"
          title="Inbox Messages"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Mail className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <button
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
