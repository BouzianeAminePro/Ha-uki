"use client";

import { useCallback, useMemo, useState } from "react";
import { TagInput } from "@/components/ui/tag-input";
import { emailRegex } from "@/consts/regex";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInvitation } from "@/hooks/useInvitation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useFriendship } from "@/hooks/useFriendship";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FriendsResult } from "@/services/friendship.service";

interface InvitationFormProps {
  gameId: string;
  onSuccess?: () => Promise<void>;
  existingInvitations?: (String | null)[];
}

export default function InvitationForm({ gameId, onSuccess, existingInvitations = [] }: InvitationFormProps) {
  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;

  const [tags, setTags] = useState<string[]>([]);

  const { data: friendshipData, isPending: isFriendshipLoading } = useFriendship(userId);

  const isValidEmails = useMemo(
    () => tags.every((tag) => emailRegex.test(tag)),
    [tags]
  );

  const form = useForm<{ emails: string[] }>({
    defaultValues: { emails: [] },
  });

  const { setValue } = form;

  const { createInvitation, setParams } = useInvitation();

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!tags?.length || !isValidEmails) {
        return;
      }

      setParams({ gameId });
      await createInvitation.mutateAsync({ data: tags });
      if (onSuccess) {
        await onSuccess();
      }
    },
    [isValidEmails, gameId, onSuccess, tags, createInvitation, setParams]
  );

  const friends = useMemo(() => {
    if (!friendshipData?.data) return [];
    return (friendshipData.data as FriendsResult).filter(friend => friend.friend.id !== userId);
  }, [friendshipData, userId]);

  const addFriendEmail = useCallback((email: string | null) => {
    if (email && !tags.includes(email)) {
      const newTags = [...tags, email];
      setTags(newTags);
      setValue("emails", newTags);
    }
  }, [tags, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitations (email)</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="test@test.fr"
                  tags={tags}
                  setTags={(newTags) => {
                    setTags(newTags);
                    setValue("emails", newTags);
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
            {isFriendshipLoading ? (
              <p>Loading friends...</p>
            ) : friends.length ? (
              friends.map(({ friend }, index) => {
                const isInvited = tags.includes(friend?.email ?? "") || existingInvitations.includes(friend.email);
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1",
                      isInvited ? "opacity-50 line-through pointer-events-none" : "cursor-pointer hover:bg-secondary/80"
                    )}
                    onClick={() => !isInvited && addFriendEmail(friend.email)}
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={friend.image || "/default-avatar.png"} alt={friend.name || "Friend"} />
                      <AvatarFallback>{friend.name?.charAt(0) || 'F'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{friend.name}</span>
                  </div>
                );
              })
            ) : (
              <p>No friends found.</p>
            )}
          </div>
        </div>
        {!isValidEmails && tags.length > 0 && (
          <Alert variant="destructive" className="dark:bg-red-900 dark:text-red-100 bg-red-100 text-red-900">
            <AlertTitle className="dark:text-red-50 text-red-800 font-semibold">Error</AlertTitle>
            <AlertDescription className="dark:text-red-200 text-red-700">
              One of the emails provided is not valid
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={!tags.length || !isValidEmails}>Invite</Button>
      </form>
    </Form>
  );
}
