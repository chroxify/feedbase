import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { WorkspaceConfigWithoutSecretProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useWorkspaceConfig() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: workspaceConfig,
    isValidating,
    error,
    mutate,
  } = useSWR<WorkspaceConfigWithoutSecretProps>(`/api/v1/workspaces/${slug}/config`, fetcher, {
    revalidateOnFocus: false,
    errorRetryInterval: 30000,
  });

  return {
    workspaceConfig,
    loading: !workspaceConfig,
    mutate,
    error,
    isValidating,
  };
}
