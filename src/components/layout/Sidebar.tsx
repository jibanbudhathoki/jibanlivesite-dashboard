import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, User, Settings, FolderKanban, 
  Code, GraduationCap, FileText, MessageSquare, Link as LinkIcon, 
  HelpCircle, Mail, Image as ImageIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Profile', href: '/admin/profile', icon: User },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Code },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Socials', href: '/admin/socials', icon: LinkIcon },
  { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white border-r border-gray-800">
      <div className="flex h-16 items-center px-6 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-lg font-bold text-white tracking-tight">Portfolio Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-600 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                )} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
