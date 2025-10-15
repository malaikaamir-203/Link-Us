import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CheckInboxPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your inbox';

  // Optional: show a toast
  useEffect(() => {
    toast.success('📬 Check your email to verify your account!');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-base-100">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-8 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold">Check Your Inbox</h1>

        {/* Message */}
        <p className="text-base-content/70">
          We've sent a verification link to:
        </p>

        <div className="font-mono text-sm bg-base-200 border border-base-300 rounded-lg px-4 py-2 inline-block mx-auto">
          {email}
        </div>

        <p className="text-sm text-base-content/60 mt-2">
          Please click the link in the email to activate your account.
        </p>

        <p className="text-xs text-base-content/50">
          If you don't see it, check your spam or junk folder.
        </p>

        {/* Optional: Resend hint (we'll build this later) */}
        {/* <p className="text-xs mt-4">
          Didn’t get the email?{" "}
          <button type="button" className="link link-primary text-xs">
            Resend verification email
          </button>
        </p> */}
      </div>
    </div>
  );
};

export default CheckInboxPage;