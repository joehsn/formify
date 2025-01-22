import { Loader as LoaderIcon } from 'lucide-react';

function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderIcon className="animate-spin text-3xl" />
    </div>
  );
}

export default Loader;
