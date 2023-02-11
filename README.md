# vetly-team-two-backend

Steps for handling your tasks and making pull requests:

Tasks will be assigned to us in Github using issues. So before you start the steps below, go to our repository page on github:

https://github.com/Ayagigs/vetly-team-two-backend

Click the issues tab or click the link:

https://github.com/Ayagigs/vetly-team-two-backend/issues

Click on the issue that was raised in your name and read the instructions. By the right hand side, you will see the status of the issue under the “Projects” section. Set it from “Todo” to “In progress”.

Then proceed with the steps below: Step 1 (Cloning Repo):

If you’re a collaborator, go to the Github Repo page, Git Clone the project, and cd into the directory.

Don’t fork it! Forking will copy it in a new Repo to your Github page, but you don’t want that — you want to collaborate on the same Github Repo with your teammates.

Git clone https://github.com/Ayagigs/vetly-team-two-backend

cd Team-Dove

Step 2 (Branching):

Create a branch for the feature you want to work on (assuming its login_page)

git checkout -b login_page

You should be able to verify this with the command:

git branch

You’re now in your new branch and can start coding away.

Step 3 (Making Commits):

Note: As a general rule, you should git add frequently and git commit when you finish something that allows your code to work (ends up being a couple times an hour). For example, when you finish a method and the code base works, git commit like so:

git commit -m "Added function to allow Users to say 'Hello World'"

Step 4 (Submitting Pull Requests):

Git push your branches

git push

Now go to the Github Repo page. You should see the branch you pushed up in a yellow bar at the top of the page with a button to “Compare & pull request”.

Note: Alternatively, you can select the branch in the drop-down “Branch:” menu and select the branch you just pushed up. You’ll then have a “Pull request” and “Compare” button on the right hand side.

Click “Compare & pull request”. This will take you to the “Open a pull request” page. From here, you should write a brief description of what you actually changed. And you should click the “Reviewers” tab and select whoever our team decided would be the “Merge Master”. When you’re done, click “Create pull request”.

As soon as you’re done, got to the repository page, then, click the issues tab or click the link:

https://github.com/Ayagigs/vetly-team-two-backend/issues

Click on the issue that you just solved and add your comments. By the right hand side, you will see the status of the issue under the “Projects” section. Set it from “In progress” to “Awaiting Review”.
