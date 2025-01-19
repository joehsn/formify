import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useUserStore from '@/lib/stores/user.store';
import { cn, envVars, fetcher } from '@/lib/utils';
import { FormType, ResponseType } from '@/types';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { validate as isUUID } from 'uuid';

function ResponsesPage() {
  const { formId } = useParams();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <h1>Not authenticated</h1>;
  }

  if (!formId || !isUUID(formId)) {
    return <h1>Form not found</h1>;
  }
  return <Responses formId={formId} />;
}

interface ResponsesProps {
  formId: string;
}

function Responses({ formId }: ResponsesProps) {
  const navigate = useNavigate();
  const response = useSWR<ResponseType[]>(
    `${envVars.VITE_API_URL}/responses/${formId}`,
    fetcher
  );

  const form = useSWR<FormType>(
    `${envVars.VITE_API_URL}/forms/${formId}`,
    fetcher
  );

  const isLoading = response.isLoading || form.isLoading;
  const error = response.error || form.error;
  const data = response.data;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error...</h1>;
  }

  return (
    <div className="mx-auto max-w-screen-md px-4 py-8">
      <Card className="z-10 border-t-8">
        <CardContent className={cn('p-6')}>
          <div className="border-b py-2 text-2xl font-bold outline-none focus:border-neutral-900">
            {form.data?.title}
          </div>
          <div className="border-b py-2 text-lg font-normal outline-none focus:border-neutral-900">
            {form.data?.description}
          </div>

          <div className="border-b py-2 text-lg font-normal outline-none focus:border-neutral-900">
            {format(new Date(form.data?.createdAt ?? new Date()), 'PPPppp')}
          </div>
          <div className="border-b py-2 text-lg font-normal outline-none focus:border-neutral-900">
            {data?.length} responses
          </div>
        </CardContent>
      </Card>
      {data?.length === 0 ? (
        <div className="my-40 flex items-center justify-center">
          <div className="text-4xl font-bold">No responses yet</div>
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 gap-4">
          {data?.map((response) => (
            <Card
              key={response._id}
              onClick={() =>
                navigate(`/response/${formId}/${response.responseId}`)
              }
              className="cursor-pointer transition-shadow duration-300 hover:shadow-simple"
            >
              <CardContent className={cn('p-6')}>
                <h1>by: {response.email}</h1>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResponsesPage;
