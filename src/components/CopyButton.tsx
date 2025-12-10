import { Copy, CopyCheck, Lock } from "lucide-react";
import { useState } from "react";

const CopyButton = ({
  text,
  isLocked = false,
}: {
  text: string;
  isLocked: boolean;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const CopyIcon = isLocked ? Lock : isCopied ? CopyCheck : Copy;
  const CopyIconColor = isLocked ? "gray" : isCopied ? "green" : "black";

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleCopy}
        className="p-2 rounded-md"
        disabled={isLocked}
      >
        <CopyIcon color={CopyIconColor} className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CopyButton;
