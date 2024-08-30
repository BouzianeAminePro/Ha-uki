"use client";

import { ReactNode, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Game } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendship } from "@/hooks/useFriendship";
import { cn } from "@/lib";
import { TagInput } from "@/components/ui/tag-input";
import useGames from "@/hooks/useGames";
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

export default function GameForm({
  game,
  children,
}: {
  game?: Game;
  children: ReactNode;
}) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const { createGame } = useGames();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { data: friendshipData, isPending: isFriendshipLoading } = useFriendship(userId);

  const form = useForm({
    defaultValues: { ...game, invitations: [] },
  });

  const { setValue } = form;

  const addFriendEmail = useCallback((email: string) => {
    if (!tags.includes(email)) {
      const newTags = [...tags, email];
      setTags(newTags);
      setValue("invitations", newTags as any);
      setSelectedFriends([...selectedFriends, email]);
    }
  }, [tags, setValue, selectedFriends]);

  const handleTagRemove = useCallback((removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
    setValue("invitations", newTags as any);
    setSelectedFriends(selectedFriends.filter(email => email !== removedTag));
  }, [tags, setValue, selectedFriends]);

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
                    setSelectedFriends(newTags);
                    const removedTags = tags.filter(tag => !(newTags as any).includes(tag));
                    removedTags.forEach(tag => handleTagRemove(tag));
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter valid email(s) (only gmail for now)
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="mt-4">
          <FormLabel>Friends</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {friendshipData?.data?.length ? friendshipData.data
              .filter(friend => friend.friend.id !== userId) // Filter out the current user
              .map((friend, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center space-x-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1",
                  selectedFriends.includes(friend.friend.email) 
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer hover:bg-secondary/80"
                )}
                onClick={() => !selectedFriends.includes(friend.friend.email) && addFriendEmail(friend.friend.email)}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={friend.friend.image || "/default-avatar.png"} alt={friend.name || "Friend"} />
                  <AvatarFallback>{friend.friend.name?.charAt(0) || 'F'}</AvatarFallback>
                </Avatar>
                <span className={cn(
                  "text-sm",
                  selectedFriends.includes(friend.friend.email) && "line-through"
                )}>
                  {friend.friend.name}
                </span>
              </div>
            )) : null}
          </div>
        </div>
        {children}
      </form>
    </Form>
  );
}
