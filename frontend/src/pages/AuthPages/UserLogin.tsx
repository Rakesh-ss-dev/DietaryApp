import { useState } from "react";
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/client/login`, {
        mobile,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));
      navigate("/patient-dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };
  return (
    <>
      <PageMeta title="SignIn" description="SignIn" />
      <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>
              <div>
                <form onSubmit={handleSignin}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Mobile Number <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter Mobile Number"
                      />
                    </div>
                    <div>
                      <Label>
                        Password <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button className="w-full" size="sm">
                        Sign in
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Already have an account? {""}
                    <Link
                      to="/signup"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex">
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <GridShape />
          <div className="flex flex-col items-center max-w-xs">
            <Link to="/" className="block mb-4">
              <img src="./images/logo/auth-logo.svg" alt="Logo" />
            </Link>
            <p className="text-3xl text-gray-200">Dietary App</p>
            <p className="text-center text-gray-400 dark:text-white/60">
              An Expert in Health & Nutrition with the commitment of making you
              live a Healthy Life
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
