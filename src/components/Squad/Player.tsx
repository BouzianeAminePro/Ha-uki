"use client";

import { useDrag } from "react-dnd";
import { AvatarIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import StatusSymbol from "../StatusSymbol/StatusSymbol";
import { cn } from "@/lib";
import { Button } from "../ui/button";

export default function Player({
  image,
  email,
  name,
  answer,
  invitationId,
}: {
  image?: string;
  email?: string;
  name?: string;
  answer?: boolean;
  invitationId?: string;
}) {
  const [{}, drag] = useDrag(
    () => ({
      type: "player",
      item: { image, email, name, answer, invitationId },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [email]
  );

  return (
    <div className={cn("flex items-center cursor-pointer")} ref={drag}>
      <Avatar className="h-9 w-9">
        {image ? (
          <AvatarImage src={image ?? ""} alt="Avatar" />
        ) : (
          <Button variant="outline" size="icon">
            <AvatarIcon />
          </Button>
        )}
      </Avatar>
      <div className="ml-4 space-y-1">
        <p
          className={cn(
            `text-sm font-medium leading-none ${
              answer === false ? "line-through" : ""
            }`
          )}
        >
          {name}
        </p>
        <p
          className={cn(
            `text-sm text-muted-foreground ${
              answer === false ? "line-through" : ""
            }`
          )}
        >
          {email}
        </p>
      </div>
      <div className="ml-auto font-medium md:px-5">
        <StatusSymbol status={answer} />
      </div>
    </div>
  );
}
