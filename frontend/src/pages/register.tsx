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
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/lib/stores/user.store';
import { handleLogOut } from '@/lib/handlers';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { envVars } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * TODOS:
 * 1. disable the submit button when the form is submitting
 * 2.
 */

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
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
        JSON.stringify({
          fullname: data.name,
          email: data.email,
          password: data.password,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      toast(response.data.message);
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === 409) {
          toast(error.response?.statusText || 'Error', {
            description: error.response?.data?.message || 'An error occurred',
            action: {
              label: 'Login',
              onClick: () => navigate('/login'),
            },
          });
        }
      } else {
        toast('An error occurred while creating your account');
      }
    }
  };

  return (
    <div className="h-full py-24">
      <div className="container flex flex-col items-center justify-center">
        {isAuthenticated ? (
          <>
            <Logo className="mb-8 block w-full text-center text-4xl" />
            <Card className="mx-auto w-full max-w-[350px]">
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
          <div>
            <Logo className="mb-8 block w-full text-center text-4xl" />
            <Card className="mx-auto w-full max-w-[350px]">
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
                            <div className="relative">
                              <Input
                                placeholder="Enter your password"
                                type={isVisible ? 'text' : 'password'}
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                className="absolute right-0 top-1/2 -translate-y-1/2 transform"
                                onClick={() => setIsVisible((prev) => !prev)}
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
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter your password again"
                                type={isVisible ? 'text' : 'password'}
                                autoComplete="new-password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      Register
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
