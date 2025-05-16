
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth(); // Using signIn instead of login to match AuthContextType

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Successfully logged in
      toast({
        title: "Login successful!",
        description: "Welcome back to AlgoForge.",
        variant: "default",
      });

      // Use email parameter for signIn instead of user object to match the function signature
      signIn(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed!",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
          <CardDescription className="text-gray-400">Enter your email and password to login</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
