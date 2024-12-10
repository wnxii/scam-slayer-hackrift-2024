import React from "react";
import QRCode from "react-qr-code";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginQRCodeProps {
  value: string;
  size?: number;
}

const LoginQRCode: React.FC<LoginQRCodeProps> = ({ value, size = 256 }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/home");
  };
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative p-4 bg-white rounded-2xl border-4 border-red-500 cursor-pointer"
        onClick={handleClick}
      >
        <QRCode value={value} size={size} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-500 rounded-full p-2">
            <Info className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
      <span className="mt-2 text-red-500 text-xl font-semibold">Singpass</span>
    </div>
  );
};

export default LoginQRCode;
