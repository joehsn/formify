import FAB from '@/components/FAB';
import useUserStore from '@/lib/stores/user.store';
import useSWR from 'swr';
import { cn, envVars, fetcher } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Eye as EyeIcon,
  MessageSquareMore as MessageIcon,
  Plus as PlusIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { FormType } from '@/types';
import { Badge } from '@/components/ui/badge';
import DeleteDailog from '@/components/DeleteDailog';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import Error from '@/components/Error';
import { handleCreateForm } from '@/lib/handlers';

function HomeAuthenticatedView() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  // FIXME: Limit the data retrieved over the network in the devtools.
  // note: labeled "forms" in network tab.
  const { data, error, isLoading } = useSWR(
    `${envVars.VITE_API_URL}/forms`,
    fetcher
  );

  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    if (data) {
      setForms(data);
    }
  }, [data, setForms]);

  if (isLoading) return <Loader />;
  if (error) return <Error />;
  return (
    <>
      <div className="py-24 container border-b-2">
        <h1 className="text-center text-4xl font-semibold">
          Welcome back, {user?.fullname}
        </h1>
      </div>
      <div className="container py-24 relative">
        <div className="mx-auto max-w-screen-md">
          {forms?.length !== 0 ? (
            <>
              <h2 className="pb-8 text-2xl font-semibold">Your forms</h2>
              <div className="grid grid-cols-1 gap-4">
                {forms.map((form) => (
                  <Card
                    key={form._id}
                    className={cn(
                      'transition-shadow duration-300 hover:shadow-simple'
                    )}
                  >
                    <CardContent
                      className={cn(
                        'flex flex-col items-start gap-x-4 px-6 py-4 sm:flex-row sm:items-center'
                      )}
                    >
                      <Badge>{form.formStatus}</Badge>
                      <Link
                        className="mb-4 mt-2 w-full flex-1 text-lg font-semibold sm:m-0"
                        to={`/form/${form._id}`}
                      >
                        {form.formTitle}
                      </Link>
                      <div className="flex w-full items-center justify-between sm:w-auto sm:gap-x-4">
                        <div className="text-neutral-400">
                          {format(
                            new Date(form.updatedAt ?? new Date()),
                            'd MMM yyyy'
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            className={cn('px-3')}
                            aria-label={`${form.formTitle} preview`}
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/preview/${form._id}`);
                            }}
                          >
                            <EyeIcon size={32} />
                          </Button>
                          <Button
                            className={cn('px-3')}
                            aria-label={`${form.formTitle} responses`}
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/responses/${form._id}`);
                            }}
                          >
                            <MessageIcon size={32} />
                          </Button>
                          <DeleteDailog
                            _id={form._id!}
                            title={form.formTitle}
                            setForms={setForms}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <FAB
                  handleClick={() =>
                    handleCreateForm((formId) => navigate('/form/' + formId))
                  }
                >
                  <PlusIcon size={24} />
                  <span className="ml-2 hidden sm:inline">New Form</span>
                </FAB>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-md border py-32">
              <span className="mb-8 text-2xl font-semibold">
                You don't have any forms
              </span>
              <Button
                onClick={() =>
                  handleCreateForm((formId) => navigate('/form/' + formId))
                }
              >
                Create new form now
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomeAuthenticatedView;
