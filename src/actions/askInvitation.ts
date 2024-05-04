'use server'
import { content } from "@/mails/askInvitation";
import { findById } from "@/services/game.service";
import { create } from "@/services/invitation.service";
import { sendMail } from "@/services/mailer.service"
import { findUserByEmail, findUserById } from "@/services/user.service";

export async function askInvitation(gameOwnerId: string, gameId: string, email?: string) {
    const gameOwner = await findUserById(gameOwnerId);
    if (!gameOwner) {
        throw new Error('This game owner doesn\'t exists');
    }
    
    const invity = await findUserByEmail(email);
    if (!invity) {
        throw new Error('This invity doesn\'t exists');
    }
    
    const game = await findById(gameId);
    if (!game) {
        throw new Error('This game doesn\'t exists');
    }
    
    if (game && !game?.public) {
        throw new Error('This game isn\'t open for invitations');
    } 

    return Promise.all([create({
        emailSent: true,
        gameId: gameId,
        userId: invity.id,
        validInvitation: false
    }), sendMail(gameOwner?.email, 'Invitation', content(gameId, email ?? ""), true)])
}