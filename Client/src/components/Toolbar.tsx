import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseCategories } from "@/lib/utils";

interface ToolbarProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
}

const Toolbar = ({ onSearch, onCategoryChange }: ToolbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search courses"
        className="w-full px-5 h-12 dark:bg-gray-900 bg-gray-50 placeholder-gray-800 dark:placeholder-gray-200 dark:text-gray-200 border-none rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="h-12 w-[180px] dark:bg-gray-900 bg-gray-50 dark:text-gray-200 border-none">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          <SelectItem value="all" className="cursor-pointer hover:!bg-gray-100 dark:hover:!bg-gray-800 dark:hover:!text-gray-200 hover:!text-gray-900">
            All Categories
          </SelectItem>
          {courseCategories.map((category) => (
            <SelectItem
              key={category.value}
              value={category.value}
              className="cursor-pointer hover:!bg-gray-100 dark:hover:!bg-gray-800 dark:hover:!text-gray-200 hover:!text-gray-900"
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;