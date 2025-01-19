import FAB from '@/components/FAB';
import useUserStore from '@/lib/stores/user.store';
import useSWR from 'swr';
import { cn, envVars, fetcher } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaEye, FaMessage, FaTrash } from 'react-icons/fa6';
import { format } from 'date-fns';
import { FormType } from '@/types';
import { handleDeleteForm } from '@/lib/handlers';

export default function Home() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return (
    <div className="container relative py-16">
      {isAuthenticated ? <AuthenticatedView /> : <h1>Welcome to Formify</h1>}
    </div>
  );
}

function AuthenticatedView() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR(
    `${envVars.VITE_API_URL}/forms`,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error...</h1>;
  return (
    <>
      <div>
        <h1 className="pb-16 text-center text-4xl font-semibold">
          Welcome back, {user?.fullname}
        </h1>
        <div className="mx-auto max-w-screen-md">
          <h2 className="pb-8 text-2xl font-semibold">Your forms</h2>
          {data?.length !== 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {data?.map(
                (form: FormType & { updatedAt: string; id: string }) => (
                  <Card
                    onClick={() => navigate(`/update/${form.id}`)}
                    key={form.id}
                    className="cursor-pointer transition-shadow duration-300 hover:shadow-simple"
                  >
                    <CardContent
                      className={cn('flex flex-row items-center gap-4 p-6')}
                    >
                      {/* TODO: Use Badge component instead for the status */}
                      <div className='text-sm text-neutral-500'>{form.status}</div>
                      <div className="text-lg flex-1 font-semibold">
                        {form.title}
                      </div>
                      <div>
                        {format(
                          new Date(form.updatedAt ?? new Date()),
                          'd MMM yyyy'
                        )}
                      </div>
                      <div 
                        className="flex gap-2"
                      >
                      <Button
                        className={cn('px-3')}
                        aria-label={`${form.title} preview`}
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/display/${form.id}`);
                        }}
                      >
                        <FaEye size={32} />
                      </Button>
                      <Button
                        className={cn('px-3')}
                        aria-label={`${form.title} responses`}
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/responses/${form.id}`);
                        }}
                      >
                        <FaMessage size={32} />
                      </Button>
                      <Button
                        className={cn('px-3')}
                        aria-label={`Delete ${form.title} form`}
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteForm(form.id);
                        }}
                      >
                        <FaTrash size={32} />
                      </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          ) : (
            <div className="flex h-44 flex-col items-center justify-center">
              <h2 className="text-lg font-semibold">
                You don't have any forms
              </h2>
            </div>
          )}
        </div>
      </div>
      <FAB />
    </>
  );
}
