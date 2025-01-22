import { Button } from './ui/button';
import { Link, useNavigate, useMatch } from 'react-router-dom';
import useUserStore from '@/lib/stores/user.store';
import Logo from './logo';
import { handleLogOut } from '@/lib/handlers';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Eye as EyeIcon } from 'lucide-react';
import Avatar from './Avatar';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onLogout = useUserStore((state) => state.onLogout);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const updateMatch = useMatch('/update/:formId');
  const isMdScreen = useMediaQuery('only screen and (min-width: 768px)');
  return (
    <nav className="bg-neutral-100 py-4 text-neutral-700 print:hidden">
      <div className="container flex items-center justify-between">
        <div>
          <Logo />
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-x-4">
            {updateMatch ? (
              <Button
                onClick={() => navigate('/form/' + updateMatch.params.formId)}
                variant="outline"
              >
                <EyeIcon size={18} />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            ) : null}
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className={cn('h-full p-0')}>
                  <Avatar />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60" align="end">
                <div className="flex flex-col gap-y-2">
                  {['account'].map((item, idx) => (
                    <Link
                      key={idx}
                      to={`/${item}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md p-2 text-neutral-800 hover:bg-neutral-200"
                    >
                      {item}
                    </Link>
                  ))}
                  <Button
                    onClick={() => {
                      handleLogOut(onLogout);
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <>
            {isMdScreen ? (
              <div className="flex gap-x-4">
                <Button asChild variant="outline">
                  <Link to="/register">Register</Link>
                </Button>
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
