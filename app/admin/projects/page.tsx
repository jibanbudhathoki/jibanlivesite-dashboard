import { GenericList } from '@/src/components/shared/GenericList';

export default function ProjectsPage() {
  return <GenericList 
    title="Projects" 
    description="Manage portfolio projects." 
    data={[{ id: 1, title: 'E-commerce App', tech: 'React, Node.js' }]} 
    columns={[{ accessorKey: 'title', header: 'Title' }, { accessorKey: 'tech', header: 'Tech Stack' }]} 
  />;
}
