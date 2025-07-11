import { Calendar } from "@/components/ui/calendar";

function DateSelector({
   date,
   setDate,
}: {
   date: Date;
   setDate: (date: Date) => void;
}) {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   return (
      <div className="w-full h-full">
         <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            required
            className="rounded-lg border"
            disabled={(date) =>
               date >
               new Date(new Date().setDate(today.getDate() + 7)) ||
               date < today
            }
         />
      </div>
   );
}

export default DateSelector;
