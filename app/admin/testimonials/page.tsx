import { GenericList } from '@/src/components/shared/GenericList';

export default function TestimonialsPage() {
  return <GenericList 
    title="Testimonials" 
    description="Manage client testimonials." 
    data={[{ id: 1, author: 'Jane Doe', role: 'CEO' }]} 
    columns={[{ accessorKey: 'author', header: 'Author' }, { accessorKey: 'role', header: 'Role' }]} 
  />;
}
