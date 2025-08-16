import { Star } from "lucide-react";
import { assets } from "../assets/assets";
import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Background Image */}
      <img
        src={assets.bgImage}
        alt="bg-image"
        className="absolute top-0 left-0 w-full h-full object-cover -z-1"
        loading="lazy"
      />

      {/* Left Panel */}
      <div className="flex-1 flex flex-col items-start justify-between p-4 md:p-10 lg:pl-40 relative z-10">
        <img
          src={assets.logo}
          alt="logo"
          className="h-16 object-contain"
          loading="lazy"
          width={64}
          height={64}
        />

        <div className="flex items-center gap-3 mb-4 max-md:mt-10">
          <img
            src={assets.group_users}
            alt="users-images"
            className="h-8 md:h-10"
            loading="lazy"
            width={40}
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
        <SignIn />
      </div>
    </div>
  );
};

export default Login;
