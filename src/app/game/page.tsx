import axios from "axios";
import { Game, Invitation } from "@prisma/client";

import { cn } from "@/lib";
import GameCard from "@/components/GameCard/GameCard";
import { getServerSession } from "next-auth";

export default async function Page() {
  const games = await axios.get(`${process.env.SERVER_URL}/api/game`);
  const session = await getServerSession();
  console.log(session);
  return (
    <div className={cn("flex flex-col gap-y-2 w-[300px]")}>
      {games?.data?.records?.map(
        (game: Game & { Invitation: Invitation[] }, index: number) => (
          <GameCard
            key={index}
            id={game.id}
            active={Boolean(game.active)}
            acceptedInvitations={
              game?.Invitation?.filter(
                (invitation: Invitation) => invitation.answer
              ).length ?? 0
            }
            maxPlayers={Number(game.maxPlayers)}
            name={String(game.name ?? "Game")}
          />
        )
      )}
    </div>
  );
}
