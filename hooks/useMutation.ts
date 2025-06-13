import { useState, useCallback } from "react";

enum MutationStatus {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
  Success = "success",
}

interface MutationConfig<TData, TVariables> {
  onSuccess?: ({ data }: { data: TData }) => void;
  onError?: ({ error }: { error: any }) => void;
  onSettled?: ({ data, error }: { data?: TData; error?: any }) => void;
}

export const useMutation = <TData = unknown, TVariables = unknown>({
  mutationFn,
  config,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  config?: MutationConfig<TData, TVariables>;
}) => {
  const [status, setStatus] = useState<MutationStatus>(MutationStatus.Idle);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(
    async (
      variables: TVariables,
      option?: MutationConfig<TData, TVariables>
    ) => {
      setStatus(MutationStatus.Loading);
      setError(null);
      setData(null);

      try {
        const result = await mutationFn(variables);
        setData(result);
        setStatus(MutationStatus.Success);
        config?.onSuccess?.({
          data: result,
        });
        config?.onSettled?.({
          data: result,
          error: null,
        });

        option?.onSuccess?.({
          data: result,
        });
        option?.onSettled?.({
          data: result,
          error: null,
        });
        return result;
      } catch (err) {
        setError(err);
        setStatus(MutationStatus.Error);
        config?.onError?.({
          error: err,
        });
        config?.onSettled?.({
          data: undefined,
          error: err,
        });

        option?.onError?.({
          error: err,
        });
        option?.onSettled?.({
          data: undefined,
          error: err,
        });
        throw err;
      }
    },
    [mutationFn, config]
  );

  return {
    mutate,
    data,
    error,
    status,
    isLoading: status === MutationStatus.Loading,
    isError: status === MutationStatus.Error,
    isSuccess: status === MutationStatus.Success,
    isIdle: status === MutationStatus.Idle,
  };
};
