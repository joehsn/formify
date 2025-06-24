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
import { useState } from 'react';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { envVars } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const onLogin = useUserStore((state) => state.onLogin);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [isVisible, setIsVisible] = useState(false);
  const form = useForm<LoginType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    try {
      const response = await axios.post(
        `${envVars.VITE_API_URL}/users/login`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      toast(response.data.message);
      onLogin(response.data.user);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast(error.response?.data?.message || 'An error occurred', {
            action: {
              label: 'Register',
              onClick: () => navigate('/register'),
            },
          });
        } else {
          toast("An error occurred while logging in")
        }
      } else {
        console.error(error);
        toast('An error occurred while logging in');
      }
    }
  };

  return (
    <div className="py-24">
      <div className="container flex flex-col items-center justify-center">
        <Logo className="mb-8 block text-center text-4xl" />
        {isAuthenticated ? (
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
        ) : (
          <Card className="mx-auto w-full max-w-[350px]">
            <CardHeader>
              <h1 className="text-2xl font-semibold">Login to your account</h1>
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
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={isVisible ? 'text' : 'password'}
                              autoComplete="current-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              className="absolute right-0 top-1/2 -translate-y-1/2 transform"
                              onClick={() => setIsVisible(!isVisible)}
                              aria-label="Toggle password visibility"
                            >
                              {isVisible ? (
                                <EyeOffIcon size={20} />
                              ) : (
                                <EyeIcon size={20} />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      const email = loginSchema.shape.email.safeParse(
                        form.getValues('email')
                      );
                      if (email.success)
                        navigate(
                          '/forgot-password?email=' +
                            encodeURIComponent(email.data)
                        );
                      else navigate('/forgot-password');
                    }}
                  >
                    Forgot password?
                  </Button>
                </CardContent>
                <CardFooter className="flex-col items-start gap-y-4">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    Login
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
}
