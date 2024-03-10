export const content = (gameId: string, email: string) =>
`
<html>
    <body style="width: 100vw; margin:0; padding:0">
        <div
            style="display: flex; justify-content: center; align-items: center; flex-direction:column; row-gap: 10px;height: 100%;">
            <div>
                This mail is subjected to you, so you can join our platform <a href="${
                    process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL
                }">Ha'uki</a>, someone who wants you to join a game send you this invitation
            </div>
            <a style="background-color: black; color: white; border-radius: 25px; padding: 15px" href="${
                process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL
            }/api/auth/signin?callbackUrl=%2Fjoin%3FgameId%3D${gameId}%26email%3D${email}" target="_blank">Join us</a>
        </div>
    </body>
</html>
`;