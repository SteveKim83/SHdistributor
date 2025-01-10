import { SignIn } from "@clerk/nextjs";

export default async function SignInPage(
  props: {
    searchParams: Promise<{ redirect_url?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        redirectUrl={searchParams.redirect_url || "/"}
      />
    </div>
  );
}
