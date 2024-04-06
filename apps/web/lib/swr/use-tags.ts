import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { FeedbackTagProps } from '../types';
import { fetcher } from '../utils';

export default function useTags() {
  const { slug } = useParams<{ slug: string }>();

  const { data: tags, isValidating } = useSWR<FeedbackTagProps['Row'][]>(
    `/api/v1/projects/${slug}/feedback/tags`,
    fetcher
  );

  return {
    tags,
    loading: !tags,
    isValidating,
  };
}
