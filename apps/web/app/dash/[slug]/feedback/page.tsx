import FeedbackHeader from '@/components/dashboard/feedback/feedback-header';
import FeedbackList from '@/components/dashboard/feedback/feedback-list';

export default async function Feedback() {
  return (
    <div className='flex h-full w-full flex-col'>
      {/* Header */}
      <FeedbackHeader />

      {/* Feedback List */}
      <FeedbackList />
    </div>
  );
}
