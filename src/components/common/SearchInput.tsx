import { MdSearch } from 'react-icons/md';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = 'Search...' }: Props) => (
  <div className="relative">
    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-64"
    />
  </div>
);

export default SearchInput;
