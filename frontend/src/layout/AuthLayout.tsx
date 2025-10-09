import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AuthLayout() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      if (localStorage.getItem("user")) navigate("/user-dashboard");
      if (localStorage.getItem("patient")) navigate("/patient-dashboard");
    }
  }, [token, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
}
