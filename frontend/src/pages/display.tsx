import { Card, CardHeader } from '@/components/ui/card';
import { FormType } from '@/types';
import { envVars, fetcher } from '@/lib/utils';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import DisplayFields from '@/components/DisplayFields';
import PageNotFound from './A404';
import Loader from '@/components/Loader';
import FAB from '@/components/FAB';
import { ChevronUp as ChevronUpIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

function DisplayForm() {
  const ref = useRef<HTMLButtonElement>(null);
  const { formId } = useParams();
  const { data, error, isLoading } = useSWR<FormType>(
    `${envVars.VITE_API_URL}/forms/${formId}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    const button = ref.current;
    const handleScroll = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (button) {
      button.addEventListener('click', handleScroll);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleScroll);
      }
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!data || error || !formId) {
    return <PageNotFound />;
  }

  return (
    <>
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
      <FAB ref={ref} aria-label="Scroll to top">
        <ChevronUpIcon size={32} />
        <span className="sr-only">Scroll to top</span>
      </FAB>
    </>
  );
}

export default DisplayForm;
