import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import loginSchema, { LoginType } from '@/lib/schemas/login.schema';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useUserStore from '@/lib/stores/user.store';
import { handleLogIn } from '@/lib/handlers';

export default function Login() {
  const navigate = useNavigate();
  const onLogin = useUserStore((state) => state.onLogin);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const form = useForm<LoginType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginType) => {
    try {
      await handleLogIn(data, (user) => {
        onLogin(user);
        navigate('/');
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="py-24">
      <div className="container flex flex-col items-center justify-center">
        {isAuthenticated ? (
          <>
            <Logo className="mb-8 block w-full text-center text-4xl" />
            <Card className="mx-auto w-full max-w-[350px]">
              <CardHeader>
                <h1 className="text-2xl font-semibold">
                  You are already logged in
                </h1>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-neutral-400">
                  You are already logged in. Logout to login to another account.
                </p>
              </CardContent>
              <CardFooter className="flex-col items-start gap-y-4">
                <Button className="w-full">
                  <Link to="/logout">Logout</Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <>
            <Logo className="mb-8 block w-full text-center text-4xl" />
            <Card className="mx-auto w-full max-w-[350px]">
              <CardHeader>
                <h1 className="text-2xl font-semibold">
                  Login to your account
                </h1>
                <div className="text-neutral-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex. john@doe.com"
                              type="email"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="********"
                              type="password"
                              autoComplete="current-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-y-4">
                    <Button className="w-full">
                      <Link to="/login">Login</Link>
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
