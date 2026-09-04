import { GenericList } from '@/src/components/shared/GenericList';

export default function FAQsPage() {
  return <GenericList 
    title="FAQs" 
    description="Manage frequently asked questions." 
    data={[{ id: 1, question: 'Are you available for freelance?', status: 'Active' }]} 
    columns={[{ accessorKey: 'question', header: 'Question' }, { accessorKey: 'status', header: 'Status' }]} 
  />;
}
