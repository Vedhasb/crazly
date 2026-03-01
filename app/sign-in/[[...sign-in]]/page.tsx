import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}