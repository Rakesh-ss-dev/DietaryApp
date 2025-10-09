import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import GridShape from "../../components/common/GridShape";
import Button from "../../components/ui/button/Button";

const Payment_successful = () => {

  const [searchParams] = useSearchParams();
  const [isDownloadActive, setIsDownloadActive] = useState(false);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const paramsObject = Object.fromEntries(searchParams.entries());
  const hasRun = useRef(false);

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/payment/generate-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paramsObject),
      });
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsDownloadActive(false)
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const sendDataToBackend = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/payment/success`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paramsObject),
        });
        if (!response.ok) throw new Error("Failed to send data");
        const result = await response.json();
        console.log("Response from backend:", result);
        setIsDownloadActive(true);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };

    sendDataToBackend();
  }, [paramsObject, SERVER_URL]);
  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="bg-white  w-2/3 p-4 mb-5 relative">
          <p className="text-center uppercase text-[#04A593] font-bold">
            Payment Successfull!
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-2/3">
              <p className="font-bold">Welcome to WoW!</p>
              <p>
                Your transformation starts now! Get ready for a healthier,
                happier you. Our team will reach out soon with the next steps.
              </p>
            </div>
            <div className="w-1/3 hidden md:block">
              <img src=".\images\wowshape.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <Button
            onClick={() => handleDownloadInvoice()}
            disabled={!isDownloadActive}
            className="btn btn-primary"
          >
            Download Invoice
          </Button>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - WOW
        </p>
      </div>
    </>
  );
};

export default Payment_successful;
