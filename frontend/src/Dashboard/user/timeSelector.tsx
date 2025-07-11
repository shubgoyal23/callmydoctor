import React from "react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

function TimeSelector({
   time,
   setTime,
   list,
}: {
   time: string;
   setTime: React.Dispatch<React.SetStateAction<string>>;
   list: string[];
}) {
   return (
      <div className="w-full h-full">
         <Select value={time} onValueChange={(value) => setTime(value)}>
            <SelectTrigger className="w-full">
               <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
               {list.map((time) => (
                  <SelectItem key={time} value={time}>
                     {time}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
}

export default TimeSelector;
