import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical, Pen } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import SettingAPI from "@/services/api/setting";
import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangePassword from "./change-password";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  image: z.union([
    z
      .instanceof(File, { message: "Image is required" })
      .refine((file) => !file || file.size !== 0 || file.size <= 5000000, {
        message: "Max size exceeded",
      }),
    z.string().trim().min(1, "Image is required"), // to hold default image
  ]),
});

function Profile({ className }: React.ComponentProps<"div">) {
  const [basicDetails, setBasicDetails] = useState<any>({});
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => SettingAPI.profile(),
    refetchOnWindowFocus: true,
  });
  const form = useForm({
    defaultValues: {
      name: data?.data?.data?.name || "",
      email: data?.data?.data?.email || "",
      mobile: data?.data?.data?.mobile || "",
      image: data?.data?.data?.image || "",
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data?.data?.data) {
      form.reset({
        name: data?.data?.data?.name || "",
        email: data?.data?.data?.email || "",
        mobile: data?.data?.data?.mobile || "",
        image: data?.data?.data?.image || "",
      });
      setBasicDetails(data?.data?.data);
    }
  }, [data]);

  const onSubmit = (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("image", data.image);
      const responce = SettingAPI.updateProfile(formData);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "Operation failed. Please try again.";
      toast.error(message);
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      form.setValue("image", file);
      const imageUrl = URL.createObjectURL(file);
      setBasicDetails({ ...basicDetails, image: imageUrl });
      event.target.value = "";
    } else {
      toast.error("Please select a valid image file ");
    }
  };

  const { isDirty } = form.formState;
  return (
    <>
      <Card className={className}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="xl:h-[28rem] xl:overflow-y-auto md:h-full ">
              <div className="p-4 flex gap-2  items-center border-b ">
                <div className="relative p-2 basis-28 shrink-0">
                  <Link
                    to="."
                    className={
                      "w-full cursor-pointer flex items-center justify-center rounded-full aspect-square  object-cover border-dotted border-2 border-black "
                    }
                  >
                    <img
                      height={20}
                      width={20}
                      src={basicDetails?.image || "/blank-photo.svg"}
                      className="h-full w-full rounded-full"
                      style={{ height: "auto", width: "auto" }}
                      alt="blank image"
                    />
                  </Link>
                  <Pen className="absolute bottom-2 right-0" />
                  <Input
                    type="file"
                    name="file"
                    className="opacity-0 cursor-pointer h-full absolute top-0"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
                <div className="flex-grow overflow-hidden">
                  <p>{basicDetails?.name || "_"}</p>
                  <p className="text-unfocused truncate max-w-full">
                    {basicDetails?.email || "_"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      Change Password
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="p-2 border-b md:space-y-2  md:px-6">
                <label className="text-unfocused md:text-sm ">Name</label>
                <FormField
                  name={"name"}
                  control={form.control}
                  render={({ field }) => (
                    <div className="col-span-2">
                      <Input {...field} type="text" placeholder="Enter Name" />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
              <div className="p-2 border-b md:space-y-2  md:px-6">
                <label className="text-unfocused md:text-sm">Email</label>
                <FormField
                  name={"email"}
                  control={form.control}
                  render={({ field }) => (
                    <div className="col-span-2">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Email Address"
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
              <div className="p-2 border-b md:space-y-2  md:px-6">
                <label className="text-unfocused md:text-sm">Mobile No.</label>
                <FormField
                  name={"mobile"}
                  control={form.control}
                  render={({ field }) => (
                    <div className="col-span-2">
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Phone Number"
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
              {isDirty && (
                <div className="p-2 flex float-right gap-4 py-6">
                  <Button
                    type="reset"
                    onClick={() => {
                      form.reset();
                    }}
                    variant={"outline"}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              )}
            </div>
          </form>
        </Form>
        <ChangePassword open={open} setOpen={setOpen} />
      </Card>
    </>
  );
}

export default Profile;
