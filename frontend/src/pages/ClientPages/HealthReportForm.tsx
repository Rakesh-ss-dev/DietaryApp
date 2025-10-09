import React, { useState, ChangeEvent, FormEvent } from "react";
import Input from "../../components/form/input/InputField";
import axios from "axios";
import { useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
interface HealthReportData {
  height: number | "";
  weight: number | "";
  vitaminD: number | "";
  vitaminB12: number | "";
  iron: number | "";
  hba1c: number | "";
  triglycerides: number | "";
  hdl: number | "";
  tsh: number | "";
  uricAcid: number | "";
}

const initialFormData: HealthReportData = {
  height: "",
  weight: "",
  vitaminD: "",
  vitaminB12: "",
  iron: "",
  hba1c: "",
  triglycerides: "",
  hdl: "",
  tsh: "",
  uricAcid: "",
};

const HealthReportForm: React.FC = () => {

  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HealthReportData>(initialFormData);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : parseFloat(value),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVER_URL}/client/addReport`,
        formData,
        config
      );
      alert(response.data.message);
      navigate("/view-reports");
    } catch (error: any) {
      if (error.response) {
        alert(
          error.response.data.message || "Something went wrong on the server."
        );
      } else if (error.request) {
        alert("No response from the server. Please check your connection.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <ComponentCard className="w-full mx-auto md:w-1/2" title="Health Report Form">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          type="number"
          placeholder="Vitamin D (ng/mL)"
          name="vitaminD"
          value={formData.vitaminD}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          placeholder="Vitamin B12 (pg/mL)"
          name="vitaminB12"
          value={formData.vitaminB12}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          placeholder="Iron (ng/mL)"
          name="iron"
          value={formData.iron}
          onChange={handleChange}
          required
        />

        <Input
          type="number"
          placeholder="HbA1c (%)"
          name="hba1c"
          value={formData.hba1c}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          placeholder="Triglycerides (mg/dL)"
          name="triglycerides"
          value={formData.triglycerides}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          placeholder="HDL (mg/dL)"
          name="hdl"
          value={formData.hdl}
          onChange={handleChange}
          required
        />

        <Input
          type="number"
          placeholder="TSH (µIU/mL)"
          name="tsh"
          value={formData.tsh}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          placeholder="Uric Acid (mg/dL)"
          name="uricAcid"
          value={formData.uricAcid}
          onChange={handleChange}
          required
        />

        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-6 rounded-xl"
          >
            Submit Report
          </button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default HealthReportForm;
