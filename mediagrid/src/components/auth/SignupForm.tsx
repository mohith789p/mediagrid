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
import { Eye, EyeOff, UserPlus } from "lucide-react";

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
    } catch (err: unknown) {
      console.error("Signup error:", err);
      let message = "Something went wrong. Please try again.";

      if (typeof err === "object" && err !== null && "code" in err) {
        switch ((err as { code: string }).code) {
          case "auth/email-already-in-use":
            message = "This email is already in use. Please log in instead.";
            break;
          case "auth/invalid-email":
            message = "The email address is invalid.";
            break;
          case "auth/weak-password":
            message = "Password is too weak.";
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
      className="w-full max animate-fade-in border shadow-2xl"
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
          Create an Account
        </CardTitle>
        <CardDescription
          className="text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Join MediaGrid to connect with friends and share moments
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
              htmlFor="name"
              className="text-lg font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

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
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-lg font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pr-10"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            {loading ? "Creating Account..." : "Sign Up"}
            {!loading && <UserPlus size={16} />}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div
          className="text-sm text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Already have an account?{" "}
          <button
            onClick={onToggleForm}
            className="font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Log in
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
