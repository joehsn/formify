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
import { envVars, logout } from '@/lib/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import useUserStore from '@/lib/stores/user.store';

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
        `${envVars.VITE_API_URL}/user/register`,
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
      <div className="container flex items-center justify-center flex-col h-[calc(100vh-12rem)]">
        {isAuthenticated ? (
          <>
            <Logo className="block w-full text-center mb-8 text-4xl" />
            <Card className="w-[350px] mx-auto">
              <CardHeader>
                <h1 className="text-2xl font-semibold">You are logged in</h1>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500">
                  You are already logged in. Do you want to logout?
                </p>
                <Button
                  onClick={() => logout(onLogout)}
                  className="w-full mt-4"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Logo className="block w-full text-center mb-8 text-4xl" />
            <Card className="w-[350px] mx-auto">
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
                            <Input placeholder="Ex. john@doe.com" {...field} />
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="********"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex-col gap-y-4 items-start">
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
