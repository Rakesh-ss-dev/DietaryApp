import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";

const CreateCoach: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isValidMobile, setIsValidMobile] = useState<boolean>(false);
  const [mobileError, setMobileError] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string): void => {
    const errorList: string[] = [];

    if (password.length < 8)
      errorList.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))
      errorList.push("Must contain at least one uppercase letter.");
    if (!/[a-z]/.test(password))
      errorList.push("Must contain at least one lowercase letter.");
    if (!/[0-9]/.test(password))
      errorList.push("Must contain at least one number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errorList.push("Must contain at least one special character.");

    setPasswordErrors(errorList);
    setIsValidPassword(errorList.length === 0);
    setPassword(password);
  };

  const validateMobile = (number: string): void => {
    const mobilePattern = /^[6-9]\d{9}$/;
    if (mobilePattern.test(number)) {
      setIsValidMobile(true);
      setMobileError("");
    } else {
      setIsValidMobile(false);
      setMobileError("Please enter a valid Indian mobile number.");
    }
    setMobile(number);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${SERVER_URL}/auth/add-user`,
        { name, email, mobile, password },
        config
      );
      alert(res.data.message);
      navigate("/coaches");
    } catch (error: any) {
      alert(error.response.data.error);
      navigate(0);
    }
  };

  return (
    <ComponentCard className="w-3/4 mx-auto md:w-1/2" title="Create Coach">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name">Name :</Label>
          </div>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email">Email :</Label>
          </div>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="mobile">Mobile Number :</Label>
          </div>
          <Input
            id="mobile"
            type="text"
            required
            value={mobile}
            onChange={(e) => validateMobile(e.target.value)}
          />
          {isValidMobile && mobile !== "" ? (
            ""
          ) : (
            <p className="text-red-400 text-sm">{mobileError}</p>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password">Password :</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
          />
          {isValidPassword ? (
            ""
          ) : (
            <ul>
              {passwordErrors.map((error, index) => (
                <li key={index} className="text-red-400 text-sm">
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button disabled={!isValidPassword || !isValidMobile} type="submit">
          Submit
        </Button>
      </form>
    </ComponentCard>
  );
};

export default CreateCoach;
