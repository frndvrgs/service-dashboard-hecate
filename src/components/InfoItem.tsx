export const InfoItem = ({
  label,
  value,
}: { label: string; value?: string | number }) => (
  <div>
    <p className="text-[#4e4e4e] text-sm font-semibold">{label}</p>
    <p className="text-white text-sm">{value}</p>
  </div>
);
