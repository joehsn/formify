import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

function A404() {
  const navigate = useNavigate();
  return (
    <div className="py-24">
      <div className="container flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl mb-8 uppercase">Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <p>You may have followed an invalid link.</p>
        <p className="my-8">
          You can go back to the{' '}
          <Link to="/" className="text-blue-500 hover:underline ">
            homepage
          </Link>
          .
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}

export default A404;
