type SearchInputProps = {
  placeholder: string;
};

export function SearchInput({ placeholder }: SearchInputProps) {
  return (
    <label className="block w-80">
      <span className="sr-only">{placeholder}</span>
      <input
        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}
