// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js"; // ✅ Use your configured instance
import { toast } from "react-hot-toast";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Use GET request to verify email
    axiosInstance
      .get(`/auth/verify-email/${token}`) // ✅ Correct route
      .then((res) => {
        toast.success(res.data.message || "Email verified successfully!");
        // ✅ Now user is verified → can log in
        navigate("/login"); // or navigate('/') if auto-login works
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "Verification failed";
        toast.error(errorMessage);
        navigate("/signup"); // or "/check-inbox" if you want
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-base-100">
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Verifying your email...</p>
        </div>
      ) : (
        <p className="text-sm text-base-content/60">Redirecting...</p>
      )}
    </div>
  );
};

export default VerifyEmailPage;