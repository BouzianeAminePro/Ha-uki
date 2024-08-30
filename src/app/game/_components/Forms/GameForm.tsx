"use client";

import { ReactNode, useState } from "react";

import { useForm } from "react-hook-form";
import { Game } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib";
import { TagInput } from "@/components/ui/tag-input";
import useGames from "@/hooks/useGames";

export default function GameForm({
  game,
  children,
}: {
  game?: Game;
  children: ReactNode;
}) {
  const { createGame } = useGames();
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
            duration: data?.duration ? JSON.parse(`${data?.duration}`) : null,
            startDate: data?.startDate
              ? new Date(data.startDate).toISOString()
              : null,
          } as Game;

          await createGame.mutateAsync(body as any);
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
                <Input
                  placeholder="start date"
                  {...(field as any)}
                  type="datetime-local"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="30" {...(field as any)} type="number" />
              </FormControl>
              <FormDescription>Duration in minutes</FormDescription>
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
                  placeholder="test@test.fr"
                  tags={tags}
                  setTags={(newTags) => {
                    setTags(newTags);
                    setValue("invitations", newTags as any);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter valid email(s) (only gmail for now)
              </FormDescription>
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
