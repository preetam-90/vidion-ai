import { useModel } from "@/contexts";

export function SimpleModelSelector() {
  const { model } = useModel();
  
  return (
    <div className="px-3 py-1.5 bg-[#1E293B] rounded-md text-sm text-gray-300">
      {model.name}
    </div>
  );
} 