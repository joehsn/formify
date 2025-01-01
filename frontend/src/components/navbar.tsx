import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import useUserStore from '@/lib/stores/user.store';
import Logo from './logo';
import { logout } from '@/lib/utils';

export default function Navbar() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const onLogout = useUserStore((state) => state.onLogout);

  return (
    <nav className="py-4 bg-neutral-100 text-neutral-700">
      <div className="container flex justify-between items-center">
        <div>
          <Logo />
        </div>
        {isAuthenticated ? (
          <Button onClick={() => logout(onLogout)}>Logout</Button>
        ) : (
          <div className="flex gap-x-4">
            <Button asChild variant="outline">
              <Link to="/register">Register</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
