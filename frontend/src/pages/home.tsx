import FAB from '@/components/FAB';
import useUserStore from '@/lib/stores/user.store';
import useSWR from 'swr';
import { cn, envVars, fetcher } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { v4 as uuidv4 } from 'uuid';
import DeleteDailog from '@/components/DeleteDailog';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import Error from '@/components/Error';

export default function Home() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    document.title = 'Formify - A modern form builder';
  }, []);

  return (
    <>
      {isAuthenticated ? <HomeAuthenticatedView /> : <HomeUnauthenticatedView />}
    </>
  );
}

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
      <div className="py-24 container">
        <h1 className="pb-16 text-center text-4xl font-semibold">
          Welcome back, {user?.fullname}
        </h1>
        <div className="mx-auto max-w-screen-md">
          <h2 className="pb-8 text-2xl font-semibold">Your forms</h2>
          {forms?.length !== 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {forms.map((form) => (
                <Card
                  key={form.id}
                  className={cn(
                    'transition-shadow duration-300 hover:shadow-simple'
                  )}
                >
                  <CardContent
                    className={cn(
                      'flex flex-col items-start gap-x-4 px-6 py-4 sm:flex-row sm:items-center'
                    )}
                  >
                    <Badge>{form.status}</Badge>
                    <Link
                      className="mb-4 mt-2 w-full flex-1 text-lg font-semibold sm:m-0"
                      to={`/update/${form.id}`}
                    >
                      {form.title}
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
                          aria-label={`${form.title} preview`}
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/form/${form.id}`);
                          }}
                        >
                          <EyeIcon size={32} />
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
                          <MessageIcon size={32} />
                        </Button>
                        <DeleteDailog
                          id={form.id!}
                          title={form.title}
                          setForms={setForms}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
      <FAB handleClick={() => navigate('/create/' + uuidv4())}>
        <PlusIcon size={24} />
        <span className="ml-2 hidden sm:inline">New Form</span>
      </FAB>
    </>
  );
}

const HomeUnauthenticatedView = () => {
  const features = [
    {
      title: 'Dynamic Form Builder',
      description:
        'Create forms with an intuitive drag-and-drop interface, complete with real-time previews.',
    },
    {
      title: 'Advanced Analytics',
      description:
        'Analyze responses with detailed insights and visualizations to make informed decisions.',
    },
    {
      title: 'Seamless Integrations',
      description:
        'Integrate with tools like Google Sheets and Slack to enhance your workflow.',
    },
  ];

  const howItWorks = [
    {
      title: 'Create',
      description:
        'Sign up and start building your forms using our user-friendly interface.',
    },
    {
      title: 'Collect',
      description:
        'Share your forms and gather responses in real-time from any device.',
    },
    {
      title: 'Analyze',
      description:
        'Review and export data effortlessly to drive insights and actions.',
    },
  ];
  return (
    <>
      <section className="bg-neutral-50 py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-neutral-600">
            Simplify Form Creation and Management
          </h2>
          <p className="mt-4 text-neutral-400">
            Build dynamic forms, collect responses, and analyze data
            effortlessly. Formify empowers individuals and teams to streamline
            their workflows.
          </p>
          <Button asChild className="mt-6">
            <Link to="register">Start for Free</Link>
          </Button>
        </div>
      </section>
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="<text-neutral-800 text-center text-3xl font-bold">
            Features
          </h3>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader
                  className={cn(
                    'text-center text-xl font-bold text-neutral-700'
                  )}
                >
                  {feature.title}
                </CardHeader>
                <CardContent>{feature.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-center text-3xl font-bold text-neutral-800">
            How It Works
          </h3>
          <div className="mt-12 grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <Card key={index}>
                <CardHeader className={cn('text-xl font-bold')}>
                  {index + 1}. {step.title}
                </CardHeader>
                <CardContent className="text-gray-600">
                  {step.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800">Contact Us</h3>
          <p className="mt-4 text-neutral-600">
            Have questions or need assistance? We're here to help.
          </p>
          <Button asChild className="mt-6">
            <a href="mailto:joehsn@outlook.com">Email Us</a>
          </Button>
        </div>
      </section>

      <footer className="bg-neutral-600 py-4 text-center text-white">
        <p>&copy; {new Date().getFullYear()} Formify. All rights reserved.</p>
      </footer>
    </>
  );
};
