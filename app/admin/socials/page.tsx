import { GenericList } from '@/src/components/shared/GenericList';

export default function SocialsPage() {
  return <GenericList 
    title="Socials" 
    description="Manage social media links." 
    data={[{ id: 1, platform: 'LinkedIn', url: 'https://linkedin.com/...' }]} 
    columns={[{ accessorKey: 'platform', header: 'Platform' }, { accessorKey: 'url', header: 'URL' }]} 
  />;
}
