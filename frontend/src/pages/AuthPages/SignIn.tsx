import { useState } from "react";
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";

export default function SignIn() {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const handleForgetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/auth/forgot`, {
        email: forgotEmail,
      });
      alert(res.data.message);
      location.reload();
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };
  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/user-dashboard");
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
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@gmail.com"
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
                    <div className="flex items-center justify-between">
                      <p
                        onClick={openModal}
                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
                      >
                        Forgot password?
                      </p>
                    </div>
                    <div>
                      <Button className="w-full" size="sm">
                        Sign in
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] m-4"
        >
          <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Forgot Password
            </h4>
            <form onSubmit={handleForgetPassword} className="flex flex-col">
              <div className="px-2 overflow-y-auto">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                  <Input
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Enter a registered email id"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm">Submit</Button>
              </div>
            </form>
          </div>
        </Modal>
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
