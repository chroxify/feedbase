import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { ProjectConfigWithoutSecretProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useProjectConfig() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: projectConfig,
    isValidating,
    error,
    mutate,
  } = useSWR<ProjectConfigWithoutSecretProps>(`/api/v1/projects/${slug}/config`, fetcher, {
    revalidateOnFocus: false,
    errorRetryInterval: 30000,
  });

  return {
    projectConfig,
    loading: !projectConfig,
    mutate,
    error,
    isValidating,
  };
}
