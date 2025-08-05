import React, { useRef, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoSelector from "../../components/layouts/auth/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import AuthInput from "../../components/layouts/auth/AuthInput";

import toast from "react-hot-toast";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUserContext } from "../../context/UserContext";

const Register = () => {
  const { updateUser } = useUserContext();

  const [profilePicture, setProfilePicture] = useState("");
  const inputData = {
    fullName: useRef(""),
    email: useRef(""),
    password: useRef(""),
    adminTokenInvite: useRef(""),
  };
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const fullName = inputData.fullName.current.value;
      const email = inputData.email.current.value;
      const password = inputData.password.current.value;
      const adminTokenInvite = inputData.adminTokenInvite.current.value;

      if (!fullName) {
        return toast.error("Missing credentials. Please fill up the form");
      }

      if (!validateEmail(email)) {
        return toast.error("Please enter a valid email address");
      }

      if (!password || !email || !fullName) {
        return toast.error("Missing credentials. Please fill up the form");
      }

      const userDetails = {
        name: fullName,
        email,
        password,
        adminTokenInvite,
      };

      const formData = new FormData();
      formData.append("userDetails", JSON.stringify(userDetails));
      formData.append("image", profilePicture);

      const { data } = await api.post(API_PATHS.AUTH.REGISTER, formData);
      if (data.success) {
        const { user } = data;

        toast.success("Resgistered successfully");
        updateUser(user);

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={(e) => handleRegister(e)}>
          <ProfilePhotoSelector
            image={profilePicture}
            setImage={setProfilePicture}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              inputRef={inputData.fullName}
              label="Full Name"
              placeholder="Bob Master"
              type="text"
            />

            <AuthInput
              inputRef={inputData.email}
              label="Email Address"
              placeholder="master@example.com"
              type="email"
            />

            <AuthInput
              inputRef={inputData.password}
              label="Password"
              placeholder="************"
              type="password"
            />

            <AuthInput
              inputRef={inputData.adminTokenInvite}
              label="Admin Invite Token"
              placeholder="************"
              type="text"
            />
          </div>

          <button
            className={`btn-primary ${
              loading ? "bg-blue-600/15 text-blue-600" : "bg-primary text-white"
            }`}
            disabled={loading}
            type="submit"
          >
            {!loading ? "Register" : "Registering..."}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Alreadey have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>{" "}
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
