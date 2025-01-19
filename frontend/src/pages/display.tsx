import { Card, CardHeader } from '@/components/ui/card';
import { FormType } from '@/types';
import { envVars, fetcher } from '@/lib/utils';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import DisplayFields from '@/components/DisplayFields';
import PageNotFound from './A404';

function DisplayForm() {
  const { formId } = useParams();
  const { data, error, isLoading } = useSWR<FormType>(
    `${envVars.VITE_API_URL}/forms/${formId}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || error || !formId) {
    return <PageNotFound />;
  }

  return (
    <div className="relative mx-auto w-full max-w-screen-md space-y-6 px-4 py-8">
      <Card className="z-10 border-t-8">
        <CardHeader>
          <div className="border-b py-2 text-2xl font-bold outline-none focus:border-neutral-900">
            {data.title}
          </div>
          <div className="border-b py-2 text-lg font-normal outline-none focus:border-neutral-900">
            {data.description}
          </div>
        </CardHeader>
      </Card>
      <DisplayFields formId={formId} fields={data.fields} />
    </div>
  );
}

export default DisplayForm;
