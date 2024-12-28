import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import useUserStore from '@/lib/stores/user.store';
import Logo from './logo';
import { toast } from '@/hooks/use-toast';
import { envVars } from '@/lib/utils';
import axios from 'axios';

export default function Navbar() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const onLogout = useUserStore((state) => state.onLogout);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${envVars.VITE_API_URL}/user/logout`,
        null,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Logged out',
          description: 'You have been logged out successfully',
          duration: 5000,
        });
        onLogout();
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred while logging out',
          duration: 5000,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="py-4 bg-neutral-100 text-neutral-700">
      <div className="container flex justify-between items-center">
        <div>
          <Logo />
        </div>
        {isAuthenticated ? (
          <Button onClick={logout}>Logout</Button>
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
