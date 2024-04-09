import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { FeedbackWithUserProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useFeedback() {
  const { slug } = useParams<{ slug: string }>();

  const { data: feedback, isValidating } = useSWR<FeedbackWithUserProps[]>(
    `/api/v1/projects/${slug}/feedback`,
    fetcher
  );

  return {
    feedback,
    loading: !feedback,
    isValidating,
  };
}
