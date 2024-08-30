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
import { cn } from "@/lib/utils"; // Make sure to import the cn utility if not already present

export default function InvitationForm({ children, gameId, onSuccess }) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [tags, setTags] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { data: friendshipData, isPending: isFriendshipLoading } = useFriendship(userId);

  const isValidEmails = useMemo(
    () => tags.every((tag) => emailRegex.test(tag)),
    [tags]
  );

  const form = useForm({
    defaultValues: { emails: [] },
    disabled: !tags?.length || !isValidEmails,
  });

  const { setValue } = form;

  const { createInvitation, setParams } = useInvitation();

  const onSubmit = useCallback(
    async (data) => {
      console.log(data, tags)
      if (!tags?.length || !isValidEmails) {
        return;
      }

      setParams({ gameId });
      await createInvitation.mutateAsync({ data: tags });
      onSuccess && await onSuccess();
    },
    [isValidEmails, gameId, onSuccess, tags]
  );

  const addFriendEmail = useCallback((email: string) => {
    if (!tags.includes(email)) {
      const newTags = [...tags, email];
      setTags(newTags);
      setValue("emails", newTags as any);
      setSelectedFriends([...selectedFriends, email]);
    }
  }, [tags, setValue, selectedFriends]);

  const handleTagRemove = useCallback((removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
    setValue("emails", newTags as any);
    setSelectedFriends(selectedFriends.filter(email => email !== removedTag));
  }, [tags, setValue, selectedFriends]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="emails"
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
                    setValue("emails", newTags as any);
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
            {friendshipData?.data?.length ? friendshipData.data.map((friend, index) => (
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
        {!isValidEmails ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              One of the mails provided is not valid{" "}
            </AlertDescription>
          </Alert>
        ) : (
          <></>
        )}
        {children}
      </form>
    </Form>
  );
}
