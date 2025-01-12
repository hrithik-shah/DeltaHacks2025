"use client"

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/homepage");
  }, [router]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}