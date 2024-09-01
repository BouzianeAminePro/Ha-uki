'use server'
import { content } from "@/mails/askInvitation";
import { findById } from "@/services/game.service";
import { create } from "@/services/invitation.service";
import { sendMail } from "@/services/mailer.service"
import { findUserByEmail, findUserById } from "@/services/user.service";

export async function askInvitation(gameOwnerId: string, gameId: string, email?: string) {
    const gameOwner = await findUserById(gameOwnerId);
    if (!gameOwner) {
        throw new Error('This game owner doesn\'t exist');
    }
    
    const requester = await findUserByEmail(email);
    if (!requester) {
        throw new Error('This requester doesn\'t exist');
    }
    
    const game = await findById(gameId);
    if (!game) {
        throw new Error('This game doesn\'t exist');
    }
    
    if (game && !game?.public) {
        throw new Error('This game isn\'t open for invitations');
    } 

    return Promise.all([
        create({
            emailSent: true,
            gameId: gameId,
            userId: requester.id,
            validInvitation: false,
            isRequest: true,
            status: 'PENDING'
        }),
        sendMail(
            gameOwner?.email,
            'Game Join Request',
            content(gameId, email ?? ""),
            true
        )
    ]);
}