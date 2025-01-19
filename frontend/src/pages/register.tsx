import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import registerSchema, { RegisterType } from '@/lib/schemas/register.schema';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { envVars } from '@/lib/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import useUserStore from '@/lib/stores/user.store';
import { handleLogOut } from '@/lib/handlers';

export default function Register() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const onLogout = useUserStore((state) => state.onLogout);
  const navigate = useNavigate();
  const form = useForm<RegisterType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterType) => {
    try {
      const response = await axios.post(
        `${envVars.VITE_API_URL}/users/register`,
        {
          fullname: data.name,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully',
          duration: 5000,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred while creating your account',
          duration: 5000,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="py-24">
      <div className="container flex h-[calc(100vh-12rem)] flex-col items-center justify-center">
        {isAuthenticated ? (
          <>
            <Logo className="mb-8 block w-full text-center text-4xl" />
            <Card className="mx-auto w-[350px]">
              <CardHeader>
                <h1 className="text-2xl font-semibold">You are logged in</h1>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500">
                  You are already logged in. Do you want to logout?
                </p>
                <Button
                  onClick={() => handleLogOut(onLogout)}
                  className="mt-4 w-full"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Logo className="mb-8 block w-full text-center text-4xl" />
            <Card className="mx-auto w-[350px]">
              <CardHeader>
                <h1 className="text-2xl font-semibold">
                  Register for an account
                </h1>
                <div className="text-neutral-400">
                  Have an account?{' '}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex. John Doe"
                              type="text"
                              autoComplete="name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="********"
                              type="password"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-y-4">
                    <Button type="submit" className="w-full">
                      Register
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
