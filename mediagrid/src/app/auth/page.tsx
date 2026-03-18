"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Blurred Background Layer */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10">
        <div className="w-full h-full bg-[url('https://th.bing.com/th/id/OIP.X4XxvqYxsq5TAfWelPmJ2QHaEK?w=331&h=186&c=7&r=0&o=7&pid=1.7&rm=3')] bg-cover bg-center backdrop-blur-md" />
      </div>

      {/* Foreground Content (stays sharp) */}
      <div className="relative z-10 max-w-md">
        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
