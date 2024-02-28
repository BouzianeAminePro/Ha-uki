"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useGame from "@/hooks/useGame";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

export default function Invitation() {
  const form = useForm({
    defaultValues: {
      gameId: "",
    },
  });

  const { createGame } = useGame();
  const { push } = useRouter();

  const onSubmit = useCallback(
    ({ gameId }, _) =>
      createGame
        .mutateAsync({ gameId })
        .then((response) =>
          response.redirected ? push(`/game/${gameId}`) : null
        ),
    [createGame, push]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bienvenue à Play-me</CardTitle>
        <CardDescription>Créer pour vous les sportifs</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifiant de la session: </FormLabel>
                  <FormControl>
                    <Input placeholder="0b19670d-da79-4a0a-ba45" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Continuer</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
