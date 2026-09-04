import { GenericList } from '@/src/components/shared/GenericList';

export default function ExperiencePage() {
  return <GenericList 
    title="Experience" 
    description="Manage work history." 
    data={[{ id: 1, role: 'Senior Developer', company: 'Tech Corp' }]} 
    columns={[{ accessorKey: 'role', header: 'Role' }, { accessorKey: 'company', header: 'Company' }]} 
  />;
}
