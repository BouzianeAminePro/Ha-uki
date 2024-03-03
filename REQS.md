## In the game page

    [x] List of my games
    [x] Make tabs for my games and public games
    [x] Public games as a card with a send request to join the game (to the createdBy)
    [] add filter (active, public, ...)

## In the game/:id page

    [] Add restriction on page, case if you're neither the creator or in the invitation list
        [] no access
        [x] no update
    [] Add the fact a user can accept or not the invitation in the game page
        [] if he accepts create the invitationb line on db
        [] for that the mail must have the game id too

## Email reqs:

    [] Send invitation mail case the user already exists
    [] Before sending invitation email add a field in invitation to prevent multiple invitations (emailSent)
    [] Case an invitation for non existing user, send en email with url prams to redirect to the game and ask him to join the platform
    [] See how i can handle the case is a new user and handle the emailSent field

# Game form

    [x] Remove start and end date, spzecify only the start date / hour, and the duration.

# Performance

    [x] See big build bundle size pages
        ![alt text](<Capture d’écran du 2024-03-02 17-19-34-1.png>)

# UI

    [x] Add a breadcrumbs
