import Avatar from '@/components/Avatar';
import Error from '@/components/Error';
import Loader from '@/components/Loader';
import useUserStore from '@/lib/stores/user.store';
import { cn, envVars, fetcher } from '@/lib/utils';
import { FormType } from '@/types';
import { format } from 'date-fns';
import { useEffect } from 'react';
import useSWR from 'swr';
import Login from './login';

function Account() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useSWR(`${envVars.VITE_API_URL}/users`, fetcher);
  const forms = useSWR<FormType[]>(`${envVars.VITE_API_URL}/forms`, fetcher);

  useEffect(() => {
    document.title = user.data?.fullname
      ? `${user.data.fullname} - Account`
      : 'Account';
  }, [user.data?.fullname]);

  const isLoading = user.isLoading || forms.isLoading;
  const error = user.error || forms.error;

  if (!isAuthenticated) return <Login />;
  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="container flex items-center justify-center py-32">
      <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:items-start">
        <Avatar className={cn('h-48 w-48 text-9xl')} />
        <div
          className={cn(
            'flex flex-col gap-4 text-center sm:text-left',
            'sm:w-96'
          )}
        >
          <div className="text-4xl font-semibold">
            {user.data?.fullname || 'Full Name'}
          </div>
          <p className="break-all text-lg">{user.data?.email || 'Email'}</p>
          <div>{forms.data?.length} forms created</div>
          <div>Joined on {format(user.data?.joinedAt, 'dd MMM yyyy')}</div>
        </div>
      </div>
    </div>
  );
}

export default Account;
