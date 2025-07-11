import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';
import type { DoctorDetails } from '@/types/Doctors';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { updateDoctorDetails } from '@/store/userSlice/userSlice';
import { useDispatch } from 'react-redux';

const ProfessionalDetailsForm = () => {
   const dispatch = useDispatch();
   const [formData, setFormData] = useState<DoctorDetails>({
      specialization: "",
      services: [],
      experience: 0,
      languages: [],
      fee: 0,
      availability: [],
      slotTime: 30,
      rating: 0
   });

   const [currentService, setCurrentService] = useState('');
   const [currentLanguage, setCurrentLanguage] = useState('');
   const [currentDay, setCurrentDay] = useState('');
   const [currentTimeRanges, setCurrentTimeRanges] = useState([{ start: '', end: '' }]);

   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

   const addService = () => {
      if (currentService.trim() && !formData.services.includes(currentService.trim())) {
         setFormData(prev => ({
            ...prev,
            services: [...prev.services, currentService.trim()]
         }));
         setCurrentService('');
      }
   };

   const removeService = (service: string) => {
      console.log(service)
      setFormData(prev => ({
         ...prev,
         services: prev.services.filter(s => s !== service)
      }));
   };

   const addLanguage = () => {
      if (currentLanguage.trim() && !formData.languages.includes(currentLanguage.trim())) {
         setFormData(prev => ({
            ...prev,
            languages: [...prev.languages, currentLanguage.trim()]
         }));
         setCurrentLanguage('');
      }
   };

   const removeLanguage = (language: string) => {
      setFormData(prev => ({
         ...prev,
         languages: prev.languages.filter(l => l !== language)
      }));
   };

   const addTimeRange = () => {
      setCurrentTimeRanges(prev => [...prev, { start: '', end: '' }]);
   };

   const removeTimeRange = (index: number) => {
      setCurrentTimeRanges(prev => prev.filter((_, i) => i !== index));
   };

   const updateTimeRange = (index: number, field: string, value: string) => {
      setCurrentTimeRanges(prev => prev.map((range, i) =>
         i === index ? { ...range, [field]: value } : range
      ));
   };

   const addAvailabilityForAllDays = () => {
      if (currentTimeRanges.some(range => range.start && range.end)) {
         const validTimeRanges = currentTimeRanges
            .filter(range => range.start && range.end)
            .map(range => `${range.start}-${range.end}`);

         for (let i = 0; i < daysOfWeek.length; i++) {
            const existingDayIndex = formData.availability.findIndex(av => av.day === daysOfWeek[i]);
            if (existingDayIndex >= 0) {
               setFormData(prev => ({
                  ...prev,
                  availability: prev.availability.map((av, index) =>
                     index === existingDayIndex
                        ? { ...av, time: [...new Set([...av.time, ...validTimeRanges])] }
                        : av
                  )
               }));
            } else {
               setFormData(prev => ({
                  ...prev,
                  availability: [...prev.availability, { day: daysOfWeek[i], time: validTimeRanges }]
               }));
            }
         }
      }
      setCurrentTimeRanges([{ start: '', end: '' }]);
   }
   const addAvailability = () => {
      if (currentDay && currentTimeRanges.some(range => range.start && range.end)) {
         const validTimeRanges = currentTimeRanges
            .filter(range => range.start && range.end)
            .map(range => `${range.start}-${range.end}`);

         const existingDayIndex = formData.availability.findIndex(av => av.day === currentDay);

         if (existingDayIndex >= 0) {
            setFormData(prev => ({
               ...prev,
               availability: prev.availability.map((av, index) =>
                  index === existingDayIndex
                     ? { ...av, time: [...new Set([...av.time, ...validTimeRanges])] }
                     : av
               )
            }));
         } else {
            setFormData(prev => ({
               ...prev,
               availability: [...prev.availability, { day: currentDay, time: validTimeRanges }]
            }));
         }

         setCurrentDay('');
         setCurrentTimeRanges([{ start: '', end: '' }]);
      }
   };

   const removeAvailability = (index: number) => {
      setFormData(prev => ({
         ...prev,
         availability: prev.availability.filter((_, i) => i !== index)
      }));
   };

   const resetForm = () => {
      setFormData({
         specialization: "",
         services: [],
         experience: 0,
         languages: [],
         fee: 0,
         availability: [],
         slotTime: 30,
         rating: 0
      });
      setCurrentDay('');
      setCurrentTimeRanges([{ start: '', end: '' }]);
      setCurrentService('');
      setCurrentLanguage('');
   };

   const handleSubmit = () => {
      api.patch("/api/v1/users/doctor", formData)
         .then((res: any) => {
            if (res.success) {
               toast.success("Doctor details updated successfully");
               dispatch(updateDoctorDetails(res.data));
               resetForm()
            }
         })
         .catch((err) => {
            console.log(err);
            toast.error(err.message || "Failed to update doctor details");
         });
   };

   return (
      <div className="relative space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="text-2xl font-bold">Professional Details Form</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-8">
                  {/* Specialization */}
                  <div className="space-y-2">
                     <Label htmlFor="specialization" className="text-sm font-medium">
                        Specialization *
                     </Label>
                     <Input
                        id="specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                        placeholder="e.g., Cardiology, Software Development, Marketing"
                        required
                     />
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                     <Label className="text-sm font-medium">Services Offered</Label>
                     <div className="flex gap-2">
                        <Input
                           type="text"
                           value={currentService}
                           onChange={(e) => setCurrentService(e.target.value)}
                           placeholder="Enter a service"
                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                        />
                        <Button type="button" onClick={addService} className="shrink-0">
                           <Plus className="h-4 w-4" />
                        </Button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {formData.services.map((service, index) => (
                           <Badge key={index} className="flex items-center gap-1 h-6 px-2  hover:bg-red-500 hover:text-white cursor-pointer" onClick={() => removeService(service)}>
                              {service}
                              <Trash2
                                 className="h-4 w-4 cursor-pointer hover:text-red-500"
                              />
                           </Badge>
                        ))}
                     </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                     <Label htmlFor="experience" className="text-sm font-medium">
                        Years of Experience *
                     </Label>
                     <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={formData.experience?.toString()}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        required
                     />
                  </div>

                  {/* Languages */}
                  <div className="space-y-4">
                     <Label className="text-sm font-medium">Languages</Label>
                     <div className="flex gap-2">
                        <Input
                           type="text"
                           value={currentLanguage}
                           onChange={(e) => setCurrentLanguage(e.target.value)}
                           placeholder="Enter a language"
                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                        />
                        <Button type="button" onClick={addLanguage} className="shrink-0">
                           <Plus className="h-4 w-4" />
                        </Button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {formData.languages.map((language, index) => (
                           <Badge key={index} variant="secondary" className="flex items-center gap-1 h-6 px-2 hover:bg-red-500 hover:text-white cursor-pointer" onClick={() => removeLanguage(language)}>
                              {language}
                              <X
                                 className="h-4 w-4 cursor-pointer hover:text-red-500"
                              />
                           </Badge>
                        ))}
                     </div>
                  </div>

                  {/* Fee */}
                  <div className="space-y-2">
                     <Label htmlFor="fee" className="text-sm font-medium">
                        Fee (per session) *
                     </Label>
                     <Input
                        id="fee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.fee?.toString()}
                        onChange={(e) => setFormData(prev => ({ ...prev, fee: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        required
                     />
                  </div>

                  {/* Slot Time */}
                  <div className="space-y-2">
                     <Label htmlFor="slotTime" className="text-sm font-medium">
                        Slot Duration (minutes) *
                     </Label>
                     <Input
                        id="slotTime"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.slotTime?.toString()}
                        onChange={(e) => setFormData(prev => ({ ...prev, slotTime: parseInt(e.target.value) || 0 }))}
                        placeholder="30"
                        required
                     />
                  </div>

                  {/* Availability */}
                  <div className="space-y-4">
                     <Label className="text-sm font-medium">Availability</Label>

                     {/* Add New Availability */}
                     <Card className="p-4">
                        <div className="space-y-4">
                           <div className="space-y-2 w-full">
                              <Label className="text-sm font-medium">Day</Label>
                              <Select
                                 value={currentDay}
                                 onValueChange={(value) => setCurrentDay(value)}
                              >
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a day" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {daysOfWeek.map(day => (
                                       <SelectItem key={day} value={day}>{day}</SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>

                           <div className="space-y-2">
                              <Label className="text-sm font-medium">Time Ranges</Label>
                              {currentTimeRanges.map((range, index) => (
                                 <div key={index} className="flex gap-2 items-center">
                                    <Input
                                       type="time"
                                       value={range.start}
                                       onChange={(e) => updateTimeRange(index, 'start', e.target.value)}
                                       className="flex-1"
                                       placeholder="Start time"
                                    />
                                    <span className="text-sm text-gray-500">to</span>
                                    <Input
                                       type="time"
                                       value={range.end}
                                       onChange={(e) => updateTimeRange(index, 'end', e.target.value)}
                                       className="flex-1"
                                       placeholder="End time"
                                    />
                                    {currentTimeRanges.length > 1 && (
                                       <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => removeTimeRange(index)}
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    )}
                                 </div>
                              ))}
                              <Button type="button" variant="outline" onClick={addTimeRange} className="w-full">
                                 <Plus className="h-4 w-4 mr-2" />
                                 Add Time Range
                              </Button>
                           </div>

                           <Button type="button" onClick={addAvailability} className="w-full">
                              Add Availability
                           </Button>
                           <Button type="button" onClick={addAvailabilityForAllDays} className="w-full">
                              Add For All Days
                           </Button>
                        </div>
                     </Card>

                     {/* Current Availability */}
                     <div className="space-y-2">
                        {formData.availability.map((availability, index) => (
                           <Card key={index} className="p-3">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <div className="font-medium">{availability.day}</div>
                                    <div className="text-sm text-accent">
                                       {availability.time.join(', ')}
                                    </div>
                                 </div>
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAvailability(index)}
                                    className="cursor-pointer"
                                 >
                                    <X className="h-4 w-4" />
                                 </Button>
                              </div>
                           </Card>
                        ))}
                     </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="button" onClick={handleSubmit} className="w-full">
                     Submit Professional Details
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default ProfessionalDetailsForm;