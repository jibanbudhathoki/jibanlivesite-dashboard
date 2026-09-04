import { GenericList } from '@/src/components/shared/GenericList';

export default function EducationPage() {
  return <GenericList 
    title="Education" 
    description="Manage educational background." 
    data={[{ id: 1, degree: 'B.S. Computer Science', institution: 'University of Technology' }]} 
    columns={[{ accessorKey: 'degree', header: 'Degree' }, { accessorKey: 'institution', header: 'Institution' }]} 
  />;
}
