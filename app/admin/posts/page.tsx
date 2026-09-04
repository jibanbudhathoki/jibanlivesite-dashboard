import { GenericList } from '@/src/components/shared/GenericList';

export default function PostsPage() {
  return <GenericList 
    title="Blog Posts" 
    description="Manage your articles and posts." 
    data={[{ id: 1, title: 'Understanding React Server Components', status: 'Published' }]} 
    columns={[{ accessorKey: 'title', header: 'Title' }, { accessorKey: 'status', header: 'Status' }]} 
  />;
}
