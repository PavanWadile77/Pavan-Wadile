"use client";

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";

export default function AdminLogin() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/10">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>Authenticate to access the CMS dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={signInWithGoogle} 
            className="w-full gap-2 text-base h-12"
            disabled={loading}
          >
            <FaGoogle /> Sign In with Google
          </Button>
          <p className="text-center text-xs text-foreground/50 mt-6">
            Only authorized administrators can access the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
