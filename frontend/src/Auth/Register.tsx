import toast from "react-hot-toast";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import GoogleLoginApp from "./GoogleLogin";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
   name: z.string().min(3),
   email: z.string().email(),
   password: z.string().min(6),
});

// Login Component
const RegisterPage = ({
   setCurrentPage,
}: {
   setCurrentPage: (page: string) => void;
}) => {
   const [isDoctor, setIsDoctor] = useState<boolean>(false);
   const form = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof loginSchema>) => {
      handleRegister(data.email, data.password, data.name);
   };

   const handleRegister = async (
      email: string,
      password: string,
      name: string
   ) => {
      api.post("/register", { email, password, name, isDoctor })
         .then((res) => {
            if (res.success) {
               toast.success("Registered successfully");
               setCurrentPage("login");
            }
         })
         .catch((err) => {
            console.error(err);
            toast.error(err.message || "Failed to register");
         });
   };

   return (
      <div className="flex gap-2 w-screen h-svh items-center justify-center">
         <Card className="w-full max-w-sm">
            <CardHeader>
               <CardTitle>Register your account</CardTitle>
               <CardDescription>
                  Enter your Details to create account
               </CardDescription>
               <CardAction>
                  <Button
                     variant="link"
                     className={"cursor-pointer"}
                     onClick={() => setCurrentPage("login")}
                  >
                     Login
                  </Button>
               </CardAction>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input placeholder="name" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input placeholder="email" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="password"
                                    type="password"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </form>
               </Form>

               <div className="w-full mt-4">
                  <Label className="flex items-start gap-3 rounded-lg border p-3">
                     <Checkbox
                        id="toggle-2"
                        defaultChecked={isDoctor}
                        onCheckedChange={(checked) => setIsDoctor(!!checked)}
                        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
                     />
                     <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                           Are you a doctor?
                        </p>
                        <p className="text-accent text-sm">
                           If you are a doctor, you can register as a doctor to
                           manage your appointments.
                        </p>
                     </div>
                  </Label>
               </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
               <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  onClick={form.handleSubmit(onSubmit)}
               >
                  Register
               </Button>
               <GoogleLoginApp />
            </CardFooter>
         </Card>
      </div>
   );
};

export default RegisterPage;
