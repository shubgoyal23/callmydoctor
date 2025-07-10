import React from "react";
import { Calendar } from "@/components/ui/calendar";

function DateSelector() {
   const [date, setDate] = React.useState<Date | undefined>(new Date());

   return (
      <div className="w-full h-full">
         <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border"
            disabled={() =>
               new Date() >
                  new Date(new Date().setDate(new Date().getDate() + 7)) ||
               new Date() < new Date()
            }
         />
      </div>
   );
}

export default DateSelector;
