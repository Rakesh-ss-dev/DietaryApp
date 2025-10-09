import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import axios from "axios";
import { useNavigate } from "react-router";

export default function UserAddressCard() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");
    navigate("/");
  };
  const { isOpen, openModal, closeModal } = useModal();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Validate input fields dynamically
  useEffect(() => {
    validatePasswords();
  }, [oldPassword, newPassword, confirmPassword]);

  const validatePasswords = () => {
    let newErrors: Record<string, string> = {};

    if (!oldPassword.trim())
      newErrors.oldPassword = "Old password is required.";

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters.";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Must contain an uppercase letter.";
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword = "Must contain a lowercase letter.";
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword = "Must contain a number.";
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      newErrors.newPassword = "Must contain a special character.";
    } else if (newPassword === oldPassword) {
      newErrors.newPassword =
        "New password cannot be the same as old password.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const { data } = await axios.post(
          `${SERVER_URL}/client/change-password`,
          {
            oldPassword: oldPassword.trim(),
            newPassword: newPassword.trim(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(data.message || "Password changed successfully!");
        logout();
      } catch (error: any) {
        console.log(error);
        alert(error.response?.data?.error || "Something went wrong!");
      }
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Credentials
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Password
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  *********
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Change Password
          </h4>
          <form onSubmit={handleSave} className="flex flex-col">
            <div className="px-2 overflow-y-auto">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    placeholder="Old Password"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showOldPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                  {errors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.oldPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                size="sm"
                disabled={!isFormValid}
                className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
