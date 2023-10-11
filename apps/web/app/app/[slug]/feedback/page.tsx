import { Card, CardDescription, CardHeader, CardTitle } from 'ui/components/ui/card';
import { getAllFeedbackTags, getAllProjectFeedback } from '@/lib/api/feedback';
import FeedbackTable from '@/components/dashboard/feedback/feedback-table';
import FeedbackHeader from '@/components/dashboard/feedback/header-buttons';

export default async function Feedback({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tag: string };
}) {
  const { data: feedback, error } = await getAllProjectFeedback(params.slug, 'server');
  if (error) {
    return <div>{error.message}</div>;
  }

  const { data: tags, error: tagsError } = await getAllFeedbackTags(params.slug, 'server');
  if (tagsError) {
    return <div>{tagsError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col gap-2'>
      {/* Header Row */}
      <FeedbackHeader tags={tags} />

      {/* Feedback Posts */}
      {/* If there is no feedback, show empty text in the center */}
      {feedback.length === 0 && (
        <Card className=' flex w-full flex-col items-center justify-center p-10 sm:p-20'>
          <CardHeader className='items-center text-center '>
            <CardTitle className='text-2xl font-medium'>No feedback yet</CardTitle>
            <CardDescription className='font-light'>
              Once somone submits feedback, it will show up here. Make sure to share it so others can vote on
              it!
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* If there is feedback, show feedback list */}
      {feedback.length > 0 && <FeedbackTable fetchedFeedback={feedback} tags={tags} />}
    </div>
  );
}
