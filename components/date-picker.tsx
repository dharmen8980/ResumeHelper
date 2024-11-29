"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

interface DatePickerProps {
  date?: Date;
  onSelect: (date?: Date) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex m-1">
          <div className="flex-1"></div>
          <PopoverClose>
            <X size={24} className="text-primary/60 hover:text-destructive" />
          </PopoverClose>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onSelect(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
