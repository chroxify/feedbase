import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamTable } from '@/components/settings/team-table';
import { getProjectMembers } from '@/lib/api/projects';

export default async function TeamSettings({ params }: { params: { slug: string } }) {
  const { data: members } = await getProjectMembers(params.slug, 'server');

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Card className='flex w-full flex-col border-none'>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Add or remove users that have access to this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamTable members={members} />
        </CardContent>
      </Card>
    </div>
  );
}
