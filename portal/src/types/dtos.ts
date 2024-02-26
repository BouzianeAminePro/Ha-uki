import { Invitation, User } from "@prisma/client";

export type UserInvitation = Invitation & { user: User };
