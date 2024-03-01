"use client";

import { useDrag } from "react-dnd";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import StatusSymbol from "../StatusSymbol/StatusSymbol";
import { cn } from "@/lib";

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
    [image, email, name, answer, invitationId]
  );
  return (
    <div className={cn("flex items-center cursor-pointer")} ref={drag}>
      <Avatar className="h-9 w-9">
        <AvatarImage src={image ?? ""} alt="Avatar" />
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <div className="ml-auto font-medium md:px-5">
        <StatusSymbol status={answer} />
      </div>
    </div>
  );
}
