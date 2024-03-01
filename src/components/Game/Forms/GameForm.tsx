"use client";

import { ReactNode, useState } from "react";

import { useForm } from "react-hook-form";
import { Game } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib";
import useGame from "@/hooks/useGame";
import { TagInput } from "@/components/ui/tag-input";

export default function GameForm({
  game,
  children,
}: {
  game?: Game;
  children: ReactNode;
}) {
  const { createGame } = useGame();
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm({
    defaultValues: { ...game, invitations: [] },
  });

  const { setValue } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          const body = {
            ...data,
            maxPlayers: data?.maxPlayers
              ? JSON.parse(`${data?.maxPlayers}`)
              : null,
          } as Game;

          await createGame.mutateAsync(body);
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  {...field}
                  value={field?.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn("flex flex-row gap-x-4")}>
          <FormField
            control={form.control}
            name="public"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Public</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="maxPlayers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max players</FormLabel>
              <FormControl>
                <Input
                  placeholder="20"
                  {...field}
                  type="number"
                  value={field?.value ?? ""}
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input placeholder="start date" {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <Input placeholder="end date" {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="invitations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitations (mail)</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Enter a topic"
                  tags={tags}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTags(newTags);
                    setValue("invitations", newTags);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
