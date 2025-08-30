import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Rechercher...",
  className,
  showFilters = false,
  onFilterToggle
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center space-x-2", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
        />
        <Input
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
      {showFilters && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onFilterToggle}
        >
          <ApperIcon name="Filter" className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;