import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      console.error("Login error:", err);
      let message = "Something went wrong. Please try again.";

      if (typeof err === "object" && err !== null && "code" in err) {
        const errorCode = (err as { code: string }).code;
        switch (errorCode) {
          case "auth/user-not-found":
            message = "IUser not found.";
            break;
          case "auth/wrong-password":
          case "auth/invalid-credential":
            message = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            message = "The email address is invalid.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your connection.";
            break;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="w-full max-w-md animate-fade-in border shadow-2xl"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-bg)",
      }}
    >
      <CardHeader>
        <CardTitle
          className="text-3xl text-center font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          Login to MediaGrid
        </CardTitle>
        <CardDescription
          className="text-center text-md"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border px-4 py-2 rounded-md text-sm text-red-600 bg-red-50 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-lg font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-lg font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-secondary)" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold flex items-center justify-center gap-2"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              borderColor: "var(--color-primary-hover)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <LogIn size={16} />}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div
          className="text-sm text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Don&apos;t have an account?{" "}
          <button
            onClick={onToggleForm}
            className="font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Sign up
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
