import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * runs an async function and tracks { data, error, loading }
 * re-runs when `deps` changes
 * guards against setting state from a stale(superseded) request
 *
 * const { data, loading, error, refetch } = useAsync(() => fetchThing(id), [id]);
 */
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true });
  const requestId = useRef(0);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    asyncFn()
      .then((data) => {
        if (id === requestId.current) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (id === requestId.current) setState({ data: undefined, error, loading: false });
      });
    // eslint-disable-next-line react-hook/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}
