import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import MultiSelect from "../../components/form/MutiSelect";
import axiosInstance from "../../api/axios";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router";

interface Option {
  label: string;
  value: string;
  price?: number;
}

const causeOptions = [
  { text: "Weight Loss", value: "Weight Loss", selected: false },
  { text: "Diabetes Reversal", value: "Diabetes Reversal", selected: false },
  { text: "PCOD/PCOS Reversal", value: "PCOD/PCOS Reversal", selected: false },
  { text: "Thyroid", value: "Thyroid", selected: false },
  { text: "Others", value: "Others", selected: false }
];

const genderOptions = [
  { label: "Male", value: "Male", selected: false },
  { label: "Female", value: "Female", selected: false },
  { label: "Others", value: "Others", selected: false },
];

const CreateRequest: React.FC = () => {
  // Form fields
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [trainers, setTrainers] = useState<Option[]>([]);
  const [cause, setCause] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  // FIX 1: Initialize trainer with empty string to avoid undefined behavior
  const [trainer, setTrainer] = useState<string>("");

  const [date_of_birth, setDate_of_birth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [optionsState, setOptionsState] = useState<Option[]>([]);
  // Validation States
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false); // New state for email
  const [isCategoryValid, setIsCategoryValid] = useState(false);
  const [isCauseValid, setIsCauseValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get(`/package/list`);
      const packages = res.data;
      const formattedOptions = packages.map((pkg: any) => ({
        label: `${pkg.name} - ${pkg.price}`,
        value: pkg._id,
      }));
      setOptionsState(formattedOptions);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await axiosInstance.get('/trainer/list');
      const formattedData = res.data.map((item: any) => ({
        value: item._id,
        label: item.name
      }));
      setTrainers(formattedData);
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchTrainers();
  }, []);

  // Mobile validation
  const validateMobile = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const mobilePattern = /^\d{6,15}$/; // Adjusted regex for flexibility
    setIsPhoneValid(mobilePattern.test(cleaned));
    setPhone(cleaned);
  };

  // Email validation (Fix for previous copy-paste error)
  const validateEmail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(value));
    setEmail(value);
  };

  const validateSelect = (value: string) => {
    setIsCategoryValid(!!value);
    setCategory(value);
  };

  const validateCauses = (selected: string[]) => {
    setIsCauseValid(selected.length > 0);
    setCause(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name,
        phone,
        city,
        package: category,
        cause,
        trainer,
        email,
        date_of_birth,
        gender,
        bloodGroup,
        height
      };
      await axiosInstance.post('/client/add', data);

      alert("Client created successfully!");
      navigate('/clients');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Create link error:", err.response?.data || err.message);
        alert(`Failed: ${JSON.stringify(err.response?.data || err.message)}`);
      } else {
        console.error("Unexpected error:", err);
        alert("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // FIX 3: Calculate if form is valid including the trainer check
  const isFormValid =
    isPhoneValid &&
    isEmailValid &&
    isCategoryValid &&
    isCauseValid &&
    name !== "" &&
    city !== "" &&
    trainer !== ""; // Essential: Check if trainer is selected

  return (
    <div className="flex h-full items-center justify-center flex-col md:flex-row p-4">
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-700 p-5">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create Client
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => validateMobile(e.target.value)}
                placeholder="Phone"
                required
              />
              {!isPhoneValid && phone !== "" && <p className="text-red-400 text-sm">Invalid phone number</p>}
            </div>

            <div>
              <Label>Date Of Birth</Label>
              <Input
                type="date"
                value={date_of_birth}
                onDateChange={(selectedDate: any) => setDate_of_birth(selectedDate[0])}
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                options={genderOptions}
                defaultValue={gender}
                onChange={(e: any) => setGender(e)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="text"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                placeholder="Email"
                required
              />
              {!isEmailValid && email !== "" && <p className="text-red-400 text-sm">Invalid email address</p>}
            </div>

            <div>
              <Label>City</Label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                required
              />
            </div>

            <div>
              <Label>Package</Label>
              <Select options={optionsState} onChange={validateSelect} placeholder="Select Package" />
              {!isCategoryValid && <p className="text-red-400 text-sm">Please select a package</p>}
            </div>

            <div>
              <MultiSelect
                label="Reason for joining"
                options={causeOptions}
                onChange={(selected) => validateCauses(selected)}
              />
              {!isCauseValid && <p className="text-red-400 text-sm">Please select at least one cause</p>}
            </div>

            <div>
              <Label>Trainer</Label>
              <Select
                options={trainers}
                onChange={(e: any) => setTrainer(e)}
                placeholder="Select Trainer"
              />
              {/* Visual feedback if missed */}
              {trainer === "" && <p className="text-gray-400 text-xs mt-1">Select a trainer to continue</p>}
            </div>
            <div>
              <Label>Blood Group</Label>
              <Input type='text' value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required placeholder="Blood Group" />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input type='number' value={height} onChange={e => setHeight(e.target.value)} required placeholder="Height in cm" />
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || loading} // Using the consolidated validation variable
              className="w-full mt-2"
            >
              {loading ? "Processing..." : "Create Client"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;