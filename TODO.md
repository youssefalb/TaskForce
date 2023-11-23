
## Missing
- [x] Send the email verification and verifying the account (After register and when the user wants to get verified)
- [] Check or add permission to acces the views for example and handle that in the f.e (a user cannot add a task or can not see a project in which he not involved)
- [x] Connect and host a DB and start working with it
- [x] Edit task details
    * A task page should show the title description and Users
    * Only users who have the permissions to Edit will be able to edit the task
- [x] Add task Dialog
- [x] Add project Dialog
- [x] See Project Info in a nice styled page and be able to edit it
- [x] User should be able to register using the normal credentials (Only Google auth is available now)
- [x] Add role names to task users data 
- [x] App icon should be changed form the next.js one [17/NOV]
- [x] use cloudinary to save images and files
- [x] Add empty component [17/NOV]
- [x] Add loading compenent [17/NOV]
- [] Check for session in the Side bar menu 
- [] Add "You don't have permission to access this page ....." component!!
- [] reset password functionality for everyone
- [] Password Security check when signing up
- [] Comments component to be shared between tickets and tasks 4
- [] Add types to a everthing to separte files

## Settings
- [x] Change the profile picture of a user and save it somewhere

## projects
- [x] Display project status in the projects page
- [x] Kick users for admin and owner roles
- [x] Add roles with permissions
- [x] Change the role of users
- [x] Update the permissions of a role and the role name
- [x] Make projectuserrole entries unique (userId, ProjectId)
- [x] Delete a role?
- [x] Add loading component[17/NOV]
- [x] A form to add a project [17/NOV]
    [x] Django view
    [x] F.e Dialog to create the prj
- [x] Add date changing for start and finish
- [x] Attach file to Tickets
- [] Project.users was never been used (Projectuserrole was used instead)
- [] profile pic handle change


## Role based access
- [x] Add project member
- [x] Change roles (Includes delete) / See them (Owner is always disabled in roles and in users as well)
- [x] Add Task, update, delete
- [x] Update project / delete it (delete_project and change_project)
- [x] for draging and droping tasks (update_task codename) [17/NOV]
- [x] view roles with permissions!(can_view_roles) [17/NOV]
- [] Before Deleting any Role you should check if there is a user with that role and warn the user that he should change the first 

## Tickets
- [X] see tickets list
- [x] Add ticket page
- [x] fetch Users data for tickets
- [x] Update Ticket Status and details
- [x] read comments
- [x] Add comments
- [x] Add ticket [18/NOV]
- [x] Changing status and prio [18/NOV]
- [x] Assign ticket to me!
- [x] Assign to someone else!
- [x] Add filter to tickets page that will show by default only the open ones (Filter by status only!!)
- [x] Attach and download files from a ticket [19/NOV]
    [x] backend (add a list of links that will be saved)
    [x] Manage Cloudinary Upload
    [x] Frontend box to display the files
- [x] Handle laoding in a better way or optimize it a bit at least
- [x] Attach tasks to tickets
- [] style buttons
- [] Delete ticket (Should tickets be deleted actually???)

## Tasks
- [x] Add a comments feature to the task
- [x] fix the coloring issue [19/NOV]
- [] redesign the page (optional)


## Toasting:
- [x] After Login or Register
- [] Settings, after change saved or not [17/NOV]

## To fix:
- [] When a user register by email the role is not default (Guest)
- [] Fix warning of encountered two children with the same key (Home/Tasks)
- [] In users when there is already an email but no signed with google, an error is thrown when trying ot sign in with google with the same email

