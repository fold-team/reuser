"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { logout } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  organizationId: string;
}

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  // Get current orgId from URL if available
  const currentOrgId = searchParams.get("orgId") || user?.organizationId;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Reuser
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard?orgId=${user.organizationId}`}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link
                    href={
                      currentOrgId ? `/login?orgId=${currentOrgId}` : "/login"
                    }
                  >
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href={
                      currentOrgId ? `/signup?orgId=${currentOrgId}` : "/signup"
                    }
                  >
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
