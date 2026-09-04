import { LayoutDashboard, Users, FolderKanban, FileText } from 'lucide-react';

const stats = [
  { name: 'Total Services', stat: '4', icon: FolderKanban },
  { name: 'Active Projects', stat: '12', icon: FileText },
  { name: 'Testimonials', stat: '8', icon: Users },
  { name: 'Profile Views', stat: '1,200', icon: LayoutDashboard },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening with your portfolio today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-white p-5 shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <dt>
              <div className="absolute rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/20">
                <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Architecture Initialized</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          The dashboard architecture follows the feature-based layout requested, ensuring highly scalable and decoupled modules for each entity (e.g. Services, Projects, Settings). Routing is protected and authenticated requests use an Axios interceptor attaching the JWT token.
        </p>
      </div>
    </div>
  );
}
