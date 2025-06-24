import { useEffect } from 'react';
import Router from './Router.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import useUserStore from './lib/stores/user.store.ts';
import { envVars, fetcher } from './lib/utils.ts';
import useSWR from 'swr';
import Loader from './components/Loader.tsx';
import Error from './components/Error.tsx';

function App() {
  const onLogin = useUserStore((state) => state.onLogin);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isNotAuthenticated = useUserStore((state) => state.isNotAuthenticated);
  // FIXME: Limit the data retrieved over the network in the devtools.
  // note: labeled "users" in network tab.
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
  if (isLoading && !isAuthenticated) return <Loader />;
  if (error) return <Error />;
  return (
    <>
      <Router />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
