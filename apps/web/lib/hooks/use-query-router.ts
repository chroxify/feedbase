import { useCallback } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation'; // Import only what you need

const useQueryParamRouter = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: ReadonlyURLSearchParams
) =>
  useCallback(
    (name: string, value: string): void => {
      // If value is empty, remove the query param
      if (!value) {
        const params = new URLSearchParams(searchParams);
        params.delete(name.toLowerCase());
        router.push(`${pathname}?${params.toString()}`);
        return;
      }

      // Set the query param
      const params = new URLSearchParams(searchParams);
      params.set(name.toLowerCase(), value.toLowerCase());

      // Push the new query string to the router
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

export default useQueryParamRouter;
