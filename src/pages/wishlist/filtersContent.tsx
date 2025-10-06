"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { debounce } from "lodash";
import { router } from "@inertiajs/react";

type FiltersContentProps = {
  initialSearch?: string;
  initialPriority?: string;
  initialBudget?: string;
  initialSort?: string;
};

// 🧹 Helper: remove empty/"all" params before sending
function cleanParams(params: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => {
      if (v === undefined || v === null) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      if (v === "all") return false;
      return true;
    })
  );
}

export const FiltersContent = ({
  initialSearch = "",
  initialPriority = "all",
  initialBudget = "all",
  initialSort = "dateAdded",
}: FiltersContentProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [budgetFilter, setBudgetFilter] = useState(initialBudget);
  const [sortBy, setSortBy] = useState(initialSort);

  // stable debounced function
  const debouncedNavigate = useMemo(
    () =>
      debounce((params: Record<string, any>) => {
        const cleaned = cleanParams(params);
        router.get(route("wishlist.index"), cleaned, {
          preserveScroll: true,
          replace: true,
        });
      }, 800),
    []
  );

  //  Trigger router.get only inside onChange handlers
  const triggerNavigate = (params: Partial<Record<string, string>>) => {
    debouncedNavigate({
      search: searchTerm,
      priority: priorityFilter,
      budget: budgetFilter,
      sortBy,
      ...params,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search brand, model, or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              triggerNavigate({ search: e.target.value });
            }}
            className="pl-8"
          />
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label>Priority</Label>
        <Select
          value={priorityFilter}
          onValueChange={(val) => {
            setPriorityFilter(val);
            triggerNavigate({ priority: val });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <Label>Budget Range</Label>
        <Select
          value={budgetFilter}
          onValueChange={(val) => {
            setBudgetFilter(val);
            triggerNavigate({ budget: val });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="under250">Under €250</SelectItem>
                <SelectItem value="250-500">€250 - €500</SelectItem>
                <SelectItem value="500-1000">€500 - €1000</SelectItem>
                <SelectItem value="1000-1500">€1000 - €1500</SelectItem>
                <SelectItem value="1500-2000">€1500 - €2000</SelectItem>
                <SelectItem value="2000-5000">€2000 - €5000</SelectItem>
                <SelectItem value="over5000">Over €5000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={sortBy}
          onValueChange={(val) => {
            setSortBy(val);
            triggerNavigate({ sortBy: val });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" disabled>
              Select an option
            </SelectItem>
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="brand">Brand</SelectItem>
            <SelectItem value="budget">Budget (High to Low)</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
