import { useEffect } from 'react';
import Router from './Router.tsx';
import { Toaster } from '@/components/ui/toaster';
import axios from 'axios';
import useUserStore from './lib/stores/user.store.ts';
import { envVars } from './lib/utils.ts';

function App() {
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${envVars.VITE_API_URL}/user`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [setUser]);
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
