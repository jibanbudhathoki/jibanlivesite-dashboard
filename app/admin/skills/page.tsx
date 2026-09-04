import { GenericList } from '@/src/components/shared/GenericList';

export default function SkillsPage() {
  return <GenericList 
    title="Skills" 
    description="Manage your technical skills." 
    data={[{ id: 1, name: 'TypeScript', level: 'Expert' }]} 
    columns={[{ accessorKey: 'name', header: 'Skill' }, { accessorKey: 'level', header: 'Proficiency' }]} 
  />;
}
