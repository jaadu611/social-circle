import React, { useState } from "react";
import { Star } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import bgImage from "../assets/bgImage.png";
import logo from "../assets/logo.svg";
import group_users from "../assets/group_users.png";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="bg-image"
        className="absolute top-0 left-0 w-full h-full object-cover -z-1"
        loading="lazy"
      />

      {/* Left Panel */}
      <div className="flex-1 flex flex-col items-start justify-between p-4 md:p-10 lg:pl-40 relative z-10">
        <img
          src={logo}
          loading="lazy"
          alt="logo"
          className="h-16 object-contain"
        />

        <div className="flex items-center gap-3 mb-4 max-md:mt-10">
          <img
            src={group_users}
            alt="users-images"
            className="h-8 md:h-10"
            loading="lazy"
            height={40}
          />
          <div className="flex flex-col">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 md:size-4.5 text-transparent fill-amber-500"
                  />
                ))}
            </div>
            <p>Used by 12k+ developers</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-[#0083B0] to-[#00B4DB] bg-clip-text text-transparent">
          More than just friends truly connect
        </h1>
        <p className="text-xl md:text-3xl text-[#019ccf] max-w-72 md:max-w-md">
          Connect with global community on Social-Circle
        </p>
        <span className="md:h-10" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="max-w-md bg-white h-fit w-fit rounded-xl shadow-lg p-6">
          {isSignUp ? (
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary:
                    "w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors",
                  formFieldInput:
                    "w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400",
                  formFieldLabel: "text-gray-700 font-medium mb-1",
                  formErrorText: "text-red-500 mt-2 text-sm",
                },
              }}
              displayConfig={{ hideClerkBranding: true }}
            />
          ) : (
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors",
                  formFieldInput:
                    "w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400",
                  formFieldLabel: "text-gray-700 font-medium mb-1",
                  formErrorText: "text-red-500 mt-2 text-sm",
                },
              }}
              displayConfig={{ hideClerkBranding: true }}
            />
          )}

          <p className="text-center text-sm pb-[2rem]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
