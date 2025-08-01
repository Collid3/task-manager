import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import AuthInput from "../../components/layouts/auth/AuthInput";
import { validateEmail } from "../../utils/helper";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import { useUserContext } from "../../context/UserContext";

import toast from "react-hot-toast";

const Login = () => {
  const { updateUser } = useUserContext();

  const formData = {
    email: useRef(""),
    password: useRef(""),
  };
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const email = formData.email.current.value;
      const password = formData.password.current.value;

      if (!validateEmail(email)) {
        return toast.error("Please enter a valid email address");
      }

      if (!password || !email) {
        return toast.error("Missing credentials. Please fill up the form");
      }

      const { data } = await api.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      if (data.success) {
        const { user } = data;
        updateUser(user);

        toast.success("LoggedIn successfully");

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        toast.error(data.message);
      }

      // Login API call
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg-w-[70%] h-3/4 md-h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black ">Welcome Back</h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
          Please enter your credentials to log in
        </p>

        <form onSubmit={(e) => handleLogin(e)}>
          <AuthInput
            inputRef={formData.email}
            label="Email Address"
            placeholder="master@example.com"
            type="email"
          />

          <AuthInput
            inputRef={formData.password}
            label="Password"
            placeholder="************"
            type="password"
          />

          <button
            className={`btn-primary ${
              loading ? "bg-blue-600/15 text-blue-600" : "bg-primary text-white"
            }`}
            disabled={loading}
            type="submit"
          >
            {!loading ? "Login" : "Logging In..."}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/register">
              SignUp
            </Link>{" "}
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
