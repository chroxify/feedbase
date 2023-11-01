import { useCallback } from 'react';
import { ReadonlyURLSearchParams } from 'next/navigation';

const useCreateQueryString = (searchParams: ReadonlyURLSearchParams) =>
  useCallback(
    (name: string, value: string): string => {
      // If value is empty, remove the query param
      if (!value) {
        const params = new URLSearchParams(searchParams);
        params.delete(name.toLowerCase());
        return params.toString();
      }

      // Set the query param
      const params = new URLSearchParams(searchParams);
      params.set(name.toLowerCase(), value.toLowerCase());
      return params.toString();
    },
    [searchParams]
  );

export default useCreateQueryString;
