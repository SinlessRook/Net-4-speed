/**
 * @file This file contains the signup page.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Wifi,
  Mail,
  Lock,
  User,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";
import Link from "next/link";

/**
 * The signup page component.
 * @returns The signup page.
 */
const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isp: "",
    avatar: "🏎️",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Multi-step form

  const avatarOptions = [
    "🏎️",
    "🚗",
    "🏁",
    "⚡",
    "🎮",
    "🚀",
    "🔥",
    "⭐",
    "🌟",
    "💎",
  ];

  /**
   * Handles the input change event.
   * @param e The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  /**
   * Validates the first step of the form.
   * @returns True if the step is valid, false otherwise.
   */
  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  /**
   * Validates the second step of the form.
   * @returns True if the step is valid, false otherwise.
   */
  const validateStep2 = () => {
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  /**
   * Handles the next button click.
   */
  const handleNext = () => {
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  /**
   * Handles the form submission.
   * @param e The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { access_token, refresh_token } = await signup(
        formData.username,
        formData.password,
      );
      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      router.push("/?welcome=true");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wifi className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">
              <span className="text-cyan-400">Network</span> Racing
            </h1>
          </div>
          <p className="text-gray-300">Join the fastest racing community!</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNum
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-8 h-1 mx-2 ${step > stepNum ? "bg-cyan-600" : "bg-gray-600"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-400">
              Step {step} of 3:{" "}
              {step === 1
                ? "Basic Info"
                : step === 2
                  ? "Security"
                  : "Personalization"}
            </span>
          </div>
        </div>

        {/* Signup Form */}
        <Card className="p-8 bg-gray-800 border-cyan-400">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-center">
              {step === 1 && "Let's start with your basic information"}
              {step === 2 && "Secure your account with a password"}
              {step === 3 && "Customize your racing profile"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-white flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a racing name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-white flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                    required
                  />
                </div>
              </>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-white flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-cyan-400" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-white flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-cyan-400" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Personalization */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="isp"
                    className="text-white flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Internet Service Provider (Optional)
                  </Label>
                  <Input
                    id="isp"
                    name="isp"
                    type="text"
                    value={formData.isp}
                    onChange={handleInputChange}
                    placeholder="e.g., Fiber Pro, Ultra ISP"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Choose Your Avatar</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, avatar }))
                        }
                        className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                          formData.avatar === avatar
                            ? "border-cyan-400 bg-cyan-900"
                            : "border-gray-600 bg-gray-700 hover:border-gray-500"
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
