import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import PasswordInput from "../common/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import SettingAPI from "@/services/api/setting";

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Old Password must be at least 6 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error shown on confirmPassword field
  });

function ChangePassword({ open, setOpen }: { open: boolean; setOpen: any }) {
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  console.log("form", form.getValues());
  console.log("error", form.formState.errors);

  const onSubmit = async (values: any) => {
    try {
      const responce = await SettingAPI.changePassword(values);
      toast.success(responce?.data?.message || "Password changed successfully");
      handleClose();
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 403) {
        form.setError("oldPassword", {
          type: "manual",
          message: error?.response?.data?.message,
        });
        return;
      }
      const message =
        error?.response?.data?.message || "Operation failed. Please try again.";
      toast.error(message);
    }
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };
  const { isSubmitting } = form.formState;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Update your password for better security.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* Current Password */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter current password"
                        {...field}
                      />
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
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Re-enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default ChangePassword;
