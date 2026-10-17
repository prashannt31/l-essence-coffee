type Props = {
  title: string;
  value: string | number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-500 text-sm">{title}</p>

      <h3 className="text-4xl mt-3 font-semibold">
        {value}
      </h3>
    </div>
  );
}