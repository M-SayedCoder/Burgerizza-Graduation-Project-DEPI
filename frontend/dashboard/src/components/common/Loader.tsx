const Loader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-slate-500 text-sm">{text}</p>
  </div>
);

export default Loader;
