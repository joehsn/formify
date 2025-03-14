import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { envVars } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

function ResetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<null | number>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const res = await axios.post(`${envVars.VITE_API_URL}/users/change-password/`, {
        token,
        newPassword: data.password
      });
      toast({
        title: res.data.message
      });
      setStatus(200)
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setStatus(error.response?.status ?? 400)
        return;
      }
      toast({
        title: "An error occurred"
      });
      console.error(error);
    }
  };

  return (
    <div className="py-24">
      <Logo className="mb-8 block text-center text-4xl" />
      {status && status !== 409 ? (
        <Response status={status} />
      ) : (
        <Card className="mx-auto w-full max-w-[350px]">
          <CardHeader>
            <div className="text-2xl font-semibold">
              Reset your password
            </div>
            <p className="text-slate-500">
              Enter your new password below
            </p>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {status && (
                  <FormMessage>
                    New password can't be the same as the old password
                  </FormMessage>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start gap-y-4">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  Send
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}

const Response = ({ status: status }: { status: number }) => {
  const [count, setCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('/');
    }, 10000);

    const interval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <Card className="mx-auto w-full max-w-[350px]">
      <CardHeader>
        <div className="text-2xl font-semibold">
          {status == 200 ? "Password changed successfully" : status === 400 ? "Invalid token" : "An error occurred"}
        </div>
        <p>
          You will be redirected to the home page in {count} seconds
        </p>
      </CardHeader>
    </Card>
  );
};

export default ResetPassword;

