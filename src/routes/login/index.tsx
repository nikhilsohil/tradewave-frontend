import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
// Validation schemas
import { z } from "zod";
import { useAuth } from "@/providers/auth";
import AuthApi from "@/services/api/auth";
import PasswordInput from "@/components/common/password-input";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login/")({
  component: LoginPage,
  loader: ({ context }) => {
    const auth = context.auth;
    if (auth?.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

export default function LoginPage() {
  const { login } = useAuth();

  const [userInfo, setUserInfo] = useState({ username: "", rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    try {
      // const response = await login(data)
      const response = await AuthApi.login(data);
      login(response?.data?.data);
      console.log("response", response);

      setUserInfo({ username: data.email, rememberMe: data.rememberMe });
    } catch (err: any) {
      if (err.response.status === 404) {
        loginForm.setError("email", { message: err.response.data.message });
        return;
      }
      if (err.response.status === 403) {
        loginForm.setError("password", { message: err.response.data.message });
        return;
      }
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your E-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Remember me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link to="/" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </form>
          </Form>

          <div className="text-center">
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3">
              <p className="font-medium mb-1">Invite Only Access</p>
              <p>
                This system requires an invitation. Contact your administrator
                for access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
