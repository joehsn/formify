import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Page Not Found - Formify';
  }, []);
  return (
    <div className="py-24">
      <div className="container flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-8 text-4xl uppercase">Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <p>You may have followed an invalid link.</p>
        <p className="my-8">
          You can go back to the{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            homepage
          </Link>
          .
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}

export default PageNotFound;
