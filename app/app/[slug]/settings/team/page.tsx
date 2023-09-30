import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamTable } from '@/components/dashboard/settings/team-table';
import { getProjectMembers } from '@/lib/api/projects';

export default async function TeamSettings({ params }: { params: { slug: string } }) {
  const { data: members, error } = await getProjectMembers(params.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto'>
      <Card className='flex w-full flex-col'>
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
