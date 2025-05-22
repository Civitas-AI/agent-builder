'use client'

import { useSession } from "next-auth/react";

export default function ProtectedComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  
  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      {/* Protected content */}
    </div>
  );
} 