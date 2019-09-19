# Introduction
I always liked the idea of having dedicated voice channels, especially one for when playing - I don't want people to randomly drop in and remove my focus. So as a small exercise I wanted to create a bot that could move users who opened a game, allowing us lazy bastards to never having to think about moving around.

This project was meant as an exercise in Python, but I realised that in my quest for becoming skilled in frontend development, it would make more sense to use JavaScript for this.

# Progress
As of **14/09/19** I am having trouble getting the bot to do what I want. The functionality is there - at least a basic version - but I can't get the status to display right. It gives me the user's status before the update happened, meaning it sets things in motion when it's too late. I can see that the documentation describes "newMember" which should work, but I am unsure how to handle that parameter.
**UPDATE:** I found that I had to state the parameter as (oldMember, newMember) for it to work. The bot now works as intended. I need to add it to a server so it always runs. Future functionality would include an opt-out function, so you can write a command (e.g. !move-opt-out) and never be moved again.

**15/09/19** I got the bot running on Heroku and worked on commands a bit. The mover can now be turned off server wide - still, I would like for the specific user to opt out.

**16/09/19** I wanted to change the way command arguments were checked, but apparently switches aren't really possible. At least not when I before hand wanted to make a check if there were more than one argument. I might return to it later to see of something can be done. I found help online to help me get the filesave working. Based on user ID I can now make an entry with what I need. I should be able to parse it and check entries, but that remains to be seen.

**19/09/19** Worked on a couple of things throughout the days, finally got the dice function to work like I want it to.

# To Do
A list of all the things I would like the bot to do.
* [x] Always run - use Heroku or similar
* [ ] Allow users to opt-out/-in
* [x] Stop function - no moving
* [ ] Move user to game specific channel - useful for often-played games
* [ ] Work in something with Steam API?
* [x] Dice rolling
* [ ] Add modifiers to dice
