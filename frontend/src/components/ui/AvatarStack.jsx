import { initials } from "../../utils/formatters.js";

export default function AvatarStack({ members = [], max = 4 }) {
  const shown = members.slice(0, max);
  return (
    <div className="flex -space-x-2">
      {shown.map((member, index) => (
        <div
          key={`${member}-${index}`}
          className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[11px] font-black text-white shadow-sm"
          title={member}
        >
          {initials(member)}
        </div>
      ))}
      {members.length > max && (
        <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-100 text-[11px] font-black text-slate-600">
          +{members.length - max}
        </div>
      )}
    </div>
  );
}
