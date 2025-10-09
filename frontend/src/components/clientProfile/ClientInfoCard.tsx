import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import axios from "axios";

const ClientInfoCard = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const patient: any = localStorage.getItem("patient");
  const parsedPatient = JSON.parse(patient);
  const [name, setName] = useState(parsedPatient?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    parsedPatient.date_of_birth || ""
  );
  const [gender, setGender] = useState(parsedPatient.gender || "");
  const [email, setEmail] = useState(parsedPatient.email || "");
  const [bloodGroup, setBloodGroup] = useState(parsedPatient.bloodGroup || '')
  const { isOpen, openModal, closeModal } = useModal();
  const payedAt = new Date(parsedPatient.payed_at);
  const formattedDate = payedAt.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // AM/PM format
  });
  const options = [
    { value: "Male", label: "Male" },
    {
      value: "Female",
      label: "Female",
    },
  ];
  const toLocalDateString = (date: Date | undefined): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Month is 0-indexed
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  };
  const validateSelect = (value: string) => {
    setGender(value);
  };
  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${SERVER_URL}/client/update`,
        { name, dateOfBirth, gender, email, bloodGroup },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));
      location.href = "/view-profile";
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[700px] m-4"
          >
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Edit Personal Information
                </h4>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                  Update your details to keep your profile up-to-date.
                </p>
              </div>
              <form onSubmit={handleSave} className="flex flex-col">
                <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                  <div className="mt-0">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <div className="col-span-2 lg:col-span-1">
                        <Label>Full Name</Label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <Label>Date Of Birth</Label>
                        <Input
                          value={dateOfBirth || ""}
                          onDateChange={(dates) =>
                            setDateOfBirth(toLocalDateString(dates[0]) || null)
                          }
                          type="date"
                          required
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <Label>Gender</Label>
                        <Select
                          options={options}
                          defaultValue={gender}
                          placeholder="Select Option"
                          onChange={validateSelect}
                          className="dark:bg-dark-900"
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <Label>Blood Group</Label>
                        <Input
                          type="text"
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <Label>Email address</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                  <Button size="sm" variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                  <Button type="submit" size="sm">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Full Name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {parsedPatient.name}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Date Of Birth
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {toLocalDateString(new Date(parsedPatient.date_of_birth)) ||
                "Not Entered"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Gender
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {parsedPatient.gender || "Not Entered"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Blood Group
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {parsedPatient.bloodGroup || "Not Entered"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Email address
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {parsedPatient.email || "Not Entered"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Phone
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {parsedPatient.phone || "Not Entered"}
            </p>
          </div>
        </div>
      </div>
      {parsedPatient.package &&
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Package Details
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Package Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {parsedPatient.package?.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Amount
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {parsedPatient.amount}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Payed At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formattedDate}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Coach Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {parsedPatient.createdBy.name}
              </p>
            </div>
          </div>

        </div>
      }
    </>
  );
};

export default ClientInfoCard;
