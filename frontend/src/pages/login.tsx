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
import { envVars } from '@/lib/utils';
import axios from 'axios';
import useUserStore from '@/lib/stores/user.store';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
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
        `${envVars.VITE_API_URL}/user/login`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        toast({
          title: 'Logged in',
          description: 'You have been logged in successfully',
          duration: 5000,
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred while logging in',
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
        <Logo className="block w-full text-center mb-8 text-4xl" />
        <Card className="w-[350px] mx-auto">
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
              </CardContent>
              <CardFooter className="flex-col gap-y-4 items-start">
                <Button className="w-full">
                  <Link to="/login">Login</Link>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
