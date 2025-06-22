import useUserStore from '@/lib/stores/user.store';
import { useEffect } from 'react';
import HomeAuthenticatedView from './homeAuthenticatedView';
import HomeUnauthenticatedView from './homeUnauthenticatedView';

function Home() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    document.title = 'Formify - A modern form builder';
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <HomeAuthenticatedView />
      ) : (
        <HomeUnauthenticatedView />
      )}
    </>
  );
}

export default Home;
