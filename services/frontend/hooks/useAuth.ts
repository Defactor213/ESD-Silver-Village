import { useEffect, useState } from 'react';

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SilverVillage.CurrentUser | null>(null);

  useEffect(() => {
    async function run() {
      const resp = await fetch(`${process.env.API_ROOT}/me`, {
        credentials: 'include',
      });
      const json = await resp.json();

      if (resp.status < 200 || resp.status >= 300) {
        throw new Error(resp.statusText);
      }
      setData(json.user);
      setLoading(false);
    }

    setLoading(true);

    run().catch((e) => {
      setData(null);
      setError(e as Error);
      setLoading(false);
    });
  }, []);

  return {
    data,
    loading,
    error,
  };
}
