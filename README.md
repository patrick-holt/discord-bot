# Introduction
I always liked the idea of having dedicated voice channels, especially one for when playing - I don't want people to randomly drop in and remove my focus. So as a small exercise I wanted to create a bot that could move users who opened a game, allowing us lazy bastards to never having to think about moving around.

This project was meant as an exercise in Python, but I realised that in my quest for becoming skilled in frontend development, it would make more sense to use JavaScript for this.

# Progress
As of **14/09/19** I am having trouble getting the bot to do what I want. The functionality is there - at least a basic version - but I can't get the status to display right. It gives me the user's status before the update happened, meaning it sets things in motion when it's too late. I can see that the documentation describes "newMember" which should work, but I am unsure how to handle that parameter.
**UPDATE:** I found that I had to state the parameter as (oldMember, newMember) for it to work. The bot now works as intended. I need to add it to a server so it always runs. Future functionality would include an opt-out function, so you can write a command (e.g. !move-opt-out) and never be moved again.

# To Do
A list of all the things I would like the bot to do.
* [ ] Always run - use Heroku or similar
* [ ] Allow users to opt-out/-in
* [ ] Stop function - no moving
* [ ] Move user to game specific channel - useful for often-played games