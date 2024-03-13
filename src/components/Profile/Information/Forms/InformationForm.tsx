"use client";

import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { AvatarIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";

export default function InformationForm({
  user,
  onSubmit,
}: {
  user?: User;
  onSubmit?: Function;
}) {
  const form = useForm({
    defaultValues: user ?? {},
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit && onSubmit(values))}
        className={cn("flex flex-col gap-y-2")}
      >
        {user?.image ? (
          <Avatar>
            <AvatarImage src={user?.image ?? ""} />
          </Avatar>
        ) : (
          <Button variant="outline" size="icon">
            <AvatarIcon />
          </Button>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  {...((field ?? {}) as any)}
                  value={field?.value ?? ""}
                />
              </FormControl>
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
                <Input
                  disabled={true}
                  placeholder="email"
                  {...((field ?? {}) as any)}
                  value={field?.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                This field is not editable for now
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
