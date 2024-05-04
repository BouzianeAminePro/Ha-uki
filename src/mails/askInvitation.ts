export const content = (gameId: string, email: string) =>
`
<html>
    <body style="width: 100%; height: 100%; margin:0; padding:0">
        <div
            style="display: flex; flex-direction:column; justify-content: center; align-items: center; row-gap: 10px;height: 100%;">
            <div>
                A player with email ${email} asked to join one of your games
                <a style="background-color: black; color: white; border-radius: 25px; padding: 15px" href="${
                    process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL
                }/game/${gameId}" target="_blank">
                    Game
                </a>
            </div>
            <div>
                <a href="${
                    process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL
                }">Ha'uki</a>
            </div>
        </div>
    </body>
</html>
`;