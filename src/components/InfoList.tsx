import React from "react";

export const InfoList = ({
  label,
  list,
}: {
  label: string;
  list?: string[];
}) => {
  return (
    <div>
      <p className="text-[#4e4e4e] text-sm font-semibold mb-1">{label}</p>
      {list?.length && (
        <div className="bg-[#202020] rounded-lg p-3">
          <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <ul className="list-decimal list-inside">
              {list?.map((value, index) => (
                <li key={index} className="text-white text-sm">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
