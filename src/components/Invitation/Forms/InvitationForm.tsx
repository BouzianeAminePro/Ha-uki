"use client";

import { useCallback, useMemo, useState } from "react";

import { TagInput } from "@/components/ui/tag-input";
import { emailRegex } from "@/consts/regex";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInvitation } from "@/hooks/useInvitation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export default function InvitationForm({ children, gameId }) {
  const [tags, setTags] = useState<string[]>([]);

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
      if (!data.emails?.length || !isValidEmails) {
        return;
      }
 
      setParams({ gameId });
      await createInvitation.mutateAsync({ data: data?.emails });
    },
    [isValidEmails, gameId]
  );

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
                  }}
                />
              </FormControl>
              <FormDescription>Enter valid email(s)</FormDescription>
            </FormItem>
          )}
        />
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
