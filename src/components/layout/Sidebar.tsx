'use client';

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, Settings, FolderKanban, 
  Code, GraduationCap, FileText, MessageSquare, 
  HelpCircle, Mail, Image as ImageIcon, ExternalLink, Globe 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessagesQuery } from '@/src/features/messages/hooks/useMessages';
import { useSettingsQuery } from '@/src/features/settings/hooks/useSettings';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Skills', href: '/skills', icon: Code },
  { name: 'Experience', href: '/experience', icon: Briefcase },
  { name: 'Education', href: '/education', icon: GraduationCap },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Posts', href: '/posts', icon: FileText },
  { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
  { name: 'Social Links', href: '/socials', icon: Globe },
  { name: 'FAQs', href: '/faqs', icon: HelpCircle },
  { name: 'Messages', href: '/messages', icon: Mail },
  { name: 'Media', href: '/media', icon: ImageIcon },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { data: messagesData } = useMessagesQuery(false);
  const unreadCount = messagesData?.meta?.unread || 0;
  const { data: settings } = useSettingsQuery();
  const liveUrl = settings?.siteUrl?.trim() || "https://jibanbudhathoki.com.np";

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white border-r border-gray-800">
      <div className="flex h-16 items-center px-6 border-b border-gray-800 shrink-0">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Visit live site: ${liveUrl}`}
          className="group flex items-center gap-2.5 text-lg font-bold text-white tracking-tight hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
          <span>Portfolio Admin</span>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-400 transition-colors opacity-70 group-hover:opacity-100" />
        </a>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-600 text-white shadow-xs" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <div className="flex items-center">
                <item.icon 
                  className={cn(
                    "mr-3 h-5 w-5 shrink-0",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                  )} 
                />
                <span>{item.name}</span>
              </div>
              {item.name === 'Messages' && unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-500 rounded-full shadow-xs">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {/* Live Site Quick Redirect Button */}
      <div className="p-3 border-t border-gray-800 shrink-0">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg bg-gray-800/80 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-indigo-600 hover:text-white transition-all shadow-2xs group"
          title={`Open Live Portfolio Website (${liveUrl})`}
        >
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400 group-hover:text-white transition-colors" />
            <span>Visit Live Site</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-white transition-colors" />
        </a>
      </div>
    </div>
  );
}
