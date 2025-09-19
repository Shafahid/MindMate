"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Phone,
  GraduationCap,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { signUp } from "../../../lib/auth";

function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    university: "",
    age: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account!");
      router.push("/signin");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 font-nohemi">
      <style jsx>{`
        .signup-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          position: relative;
          overflow: hidden;
        }
        .signup-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        .signup-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-purple-100/30 overflow-hidden rounded-[40px] border-1 border-purple-300">
          <div className="grid min-h-[700px] lg:grid-cols-2">
            {/* Left Side */}
            <div className="brand-side relative m-4 rounded-3xl bg-[url('/signup.png')] bg-cover bg-center p-12 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-indigo-900/60 rounded-3xl"></div>
              <div className="relative h-full flex flex-col justify-end">
                <div className="mb-6 text-lg font-semibold">MindMate</div>
                <h1 className="mb-4 text-6xl font-medium">
                  Start Your Wellness Journey
                </h1>
                <p className="mb-12 text-xl opacity-80">
                  Join our community and take the first step towards better
                  mental health
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <Image
                    src="/mindmate.png"
                    alt="MindMate Logo"
                    width={140}
                    height={32}
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-3xl font-light uppercase">
                    Create Account
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Join MindMate and start your mental wellness journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      id="firstName"
                      name="firstName"
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      label="First Name"
                    />
                    <InputField
                      id="lastName"
                      name="lastName"
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      label="Last Name"
                    />
                  </div>

                  {/* University */}
                  <InputField
                    id="university"
                    name="university"
                    icon={<GraduationCap className="h-5 w-5 text-gray-400" />}
                    value={formData.university}
                    onChange={handleInputChange}
                    placeholder="Your university"
                    label="University"
                  />

                  {/* Age & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      id="age"
                      name="age"
                      type="number"
                      icon={<Calendar className="h-5 w-5 text-gray-400" />}
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      label="Age"
                    />
                    <InputField
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      icon={<Phone className="h-5 w-5 text-gray-400" />}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      label="Phone"
                    />
                  </div>

                  {/* Email */}
                  <InputField
                    id="email"
                    name="email"
                    type="email"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    label="Email address"
                  />

                  {/* Password */}
                  <PasswordField
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    show={showPassword}
                    toggle={() => setShowPassword(!showPassword)}
                    placeholder="Create password"
                    label="Password"
                  />

                  {/* Confirm Password */}
                  <PasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    show={showConfirmPassword}
                    toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    placeholder="Confirm password"
                    label="Confirm Password"
                  />

                  {/* Terms */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="border-border text-primary h-4 w-4 rounded"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm text-gray-600"
                    >
                      I agree to the Privacy Policy and Terms of Service
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="signup-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Creating account...</span>
                      </>
                    ) : (
                      "Create your account"
                    )}
                  </button>
                </form>

                <div className="text-muted-foreground mt-8 text-center text-sm">
                  Already have an account?{" "}
                  <a
                    href="/signin"
                    className="text-primary hover:text-primary/80"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  icon,
  type = "text",
}: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-3 pl-10 text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  name,
  value,
  onChange,
  show,
  toggle,
  placeholder,
  label,
}: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          className="border-border bg-gray-100 block w-full rounded-lg border py-3 pr-12 pl-10 text-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={toggle}
        >
          {show ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
