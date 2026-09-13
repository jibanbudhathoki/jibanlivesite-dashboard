import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  FileText, 
  Mail, 
  ArrowRight, 
  User, 
  Clock, 
  ChevronRight,
  Inbox
} from 'lucide-react';
import { useMessagesQuery } from '@/src/features/messages/hooks/useMessages';

export function DashboardOverview() {
  const { data: messagesData, isLoading: isMessagesLoading } = useMessagesQuery(false);
  const messages = messagesData?.data || [];
  const meta = messagesData?.meta || { total: 0, unread: 0 };
  const recentMessages = messages.slice(0, 5);

  const stats = [
    { 
      name: 'Inbox Messages', 
      stat: isMessagesLoading ? '...' : `${meta.total}`, 
      subtitle: meta.unread > 0 ? `${meta.unread} unread` : 'All caught up',
      icon: Mail,
      to: '/messages',
      badge: meta.unread > 0 ? `${meta.unread} New` : undefined,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
    },
    { 
      name: 'Profile & Bio', 
      stat: 'Live', 
      subtitle: 'About story & hero',
      icon: User,
      to: '/profile',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
    },
    { 
      name: 'Services', 
      stat: 'Manage', 
      subtitle: 'Offerings & skills',
      icon: FolderKanban,
      to: '/services',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    },
    { 
      name: 'Projects', 
      stat: 'Portfolio', 
      subtitle: 'Featured works',
      icon: FileText,
      to: '/projects',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
    },
  ];

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, Jiban. Here is an overview of your portfolio activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            Edit Profile
          </Link>
          <Link
            to="/messages"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-500 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Open Inbox
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-xs border border-gray-200 hover:border-indigo-400 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-indigo-600 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              {item.badge && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {item.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {item.stat}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-between">
                <span>{item.subtitle}</span>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries Feed */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Recent Contact Inquiries
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct inquiries sent by visitors through your portfolio contact form.
              </p>
            </div>
          </div>
          <Link
            to="/messages"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <span>View All ({meta.total})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isMessagesLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading recent messages...
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              No inquiries yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              When a visitor submits a project inquiry on your portfolio, their message and details will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentMessages.map((msg) => (
              <Link
                key={msg.id}
                to="/messages"
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors ${
                  !msg.isRead ? 'bg-blue-50/20 dark:bg-blue-950/10 font-medium' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="pt-1 shrink-0">
                    {!msg.isRead ? (
                      <span className="block h-2 w-2 rounded-full bg-blue-600" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${!msg.isRead ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="text-xs text-gray-800 dark:text-gray-200 font-medium truncate">
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 text-xs text-gray-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {formatDate(msg.createdAt)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* System Status & Architecture Summary */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
          Platform Integration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Your portfolio and admin dashboard are directly connected to your Cloudflare Worker backend (<code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">https://hostapi.jibanbudhathoki.com.np/api</code>). Inquiries submitted by clients are validated, filtered against spam, and stored in the D1 SQL database in real time.
        </p>
      </div>
    </div>
  );
}
