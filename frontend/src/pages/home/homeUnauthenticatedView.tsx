import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function HomeUnauthenticatedView() {
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
      <section className="bg-neutral-50 py-32 text-center">
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
}

export default HomeUnauthenticatedView;
