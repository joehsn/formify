import { AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
function Error() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="flex h-screen items-center justify-center gap-4 p-12">
        <AlertOctagon className="text-red-500" size={128} />
        <div>
          <h1 className="text-4xl font-bold">Ooops!!</h1>
          <p className="text-lg text-gray-500 mb-4"
          >Something went wrong</p>
          <div className="flex gap-4">
            <Button onClick={() => navigate(0)} className="mt-4">
              Reload
            </Button>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
