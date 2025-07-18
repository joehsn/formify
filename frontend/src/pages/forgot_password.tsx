import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn, envVars } from '@/lib/utils';
import axios from 'axios';

const emailSchema = z.object({
  email: z.string().nonempty('Email is required').email(),
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const email = decodeURIComponent(searchParams.get('email') ?? '');
  const form = useForm({
    defaultValues: {
      email: email,
    },
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    try {
      axios.post(`${envVars.VITE_API_URL}/users/forgot-password/`, data);
    } catch (error) {
      toast('An error occured');
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative flex min-h-dvh">
      <div className="container flex flex-col items-center justify-center py-24 md:w-1/2">
        <Logo className="mb-8 rounded-md border border-foreground bg-background text-center text-4xl" />
        <Card className="mx-auto w-full max-w-md lg:border-none lg:shadow-none">
          {form.formState.isSubmitSuccessful ? (
            <>
              <CardHeader className={cn('text-2xl font-bold')}>
                Email Sent
              </CardHeader>
              <CardContent className={cn('space-y-3 text-slate-800')}>
                <p>
                  We have sent you an email with a link to reset your password.
                </p>
                <p>
                  If you do not receive an email, please check your spam folder
                  or try again.
                </p>
                <p className="text-slate-500">
                  You also may close this window now.
                </p>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="text-2xl font-semibold">Forgot Password</div>
                <p className="text-slate-500">
                  Enter your email address and we will send you a link to reset
                  your password.
                </p>
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
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-y-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      send
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </>
          )}
        </Card>
      </div>
      <div className="absolute inset-0 -z-10 flex h-full w-full items-center justify-center overflow-hidden lg:relative lg:w-1/2">
        <img
          src="/login.jpg"
          loading="lazy"
          width={4877}
          height={7375}
          className="block h-full max-h-dvh object-cover"
        />
      </div>
    </div>
  );
}

export default ForgotPassword;
