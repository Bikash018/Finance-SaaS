import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
  <ClerkLoaded>
  <SignUp />
  </ClerkLoaded>
  <ClerkLoading>
      <div className="w-full flex justify-center">
      <Loader2 className="animate-spin text-muted-foreground text-center"/>
      </div>
  </ClerkLoading>
</div>
</div>
  )
}


