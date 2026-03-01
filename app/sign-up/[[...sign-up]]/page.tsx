import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}