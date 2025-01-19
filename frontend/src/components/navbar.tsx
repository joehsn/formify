import { Button } from './ui/button';
import { Link, useNavigate, useMatch } from 'react-router-dom';
import useUserStore from '@/lib/stores/user.store';
import Logo from './logo';
import { handleLogOut } from '@/lib/handlers';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { FaEye } from 'react-icons/fa6';

function Navbar() {
  const onLogout = useUserStore((state) => state.onLogout);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const updateMatch = useMatch('/update/:formId');
  return (
    <nav className="bg-neutral-100 py-4 text-neutral-700">
      <div className="container flex items-center justify-between">
        <div>
          <Logo />
        </div>
        {isAuthenticated ? (
          <div>
            { updateMatch ? (
              <Button
                onClick={() =>
                  navigate('/display/' + updateMatch.params.formId)
                }
                variant="ghost"
              >
                <FaEye size={18} />
                <span className="sr-only">Preview</span>
              </Button>
            ) : null}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className={cn('p-0 h-full')}>
                  <Avatar />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60" align="end">
                <div className="flex flex-col gap-y-2">
                  {['account'].map((item, idx) => (
                    <Link
                      key={idx}
                      to={`/${item}`}
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

export function Avatar() {
  const user = useUserStore((state) => state.user);
  const letter = user?.fullname[0].toUpperCase();
  return (
    <div className="container flex select-none items-center justify-end">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800">
        {letter}
      </div>
    </div>
  );
}

export default Navbar;
