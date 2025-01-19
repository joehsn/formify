import { useEffect } from 'react';
import Router from './Router.tsx';
import { Toaster } from '@/components/ui/toaster';
import useUserStore from './lib/stores/user.store.ts';
import { envVars, fetcher } from './lib/utils.ts';
import useSWR from 'swr';

function App() {
  const onLogin = useUserStore((state) => state.onLogin);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isNotAuthenticated = useUserStore((state) => state.isNotAuthenticated);
  const { data, error, isLoading } = useSWR(
    `${envVars.VITE_API_URL}/users`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  useEffect(() => {
    if (data) {
      onLogin(data);
    } else {
      isNotAuthenticated();
    }
  }, [data, onLogin, isNotAuthenticated]);
  if (isLoading && !isAuthenticated) return <h1>Loading...</h1>;
  if (error) return <h1>Error...</h1>;
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
