## Codecraft

This is a mean stack based learning platform ideal to be hosted in colleges. The features of the site have been designed to provide an overall learning experience to the students, where they learn individually through content, and interact with other students through blogs and discussions. 

**Features**

1. The learn section supports content as text, videos and ebooks. This content will be controlled by the admin and content-managers of the sites.
2. The discuss section gives the user the power to interact with others and clear all the confusion and questions which one may have. It works something like the discuss platform on codechef and other coding websites.  
3. Users can write blogs on topics of their choice and help share information on the site.
4. The site features its own judge also written in node.js. Allowes users to run and share code in various languages.
5. Also includes a notification engine to notify users to new content added to the site, comments or answers on their contributions.
6. Maintains a user profile which enables users to search people working on various technologies in the institution.

**Utilities** 

1. Have implemented the tinyMCE WYSIWYG editor for all the editing tasks. The editor currently does not support local image upload, images
from other websites can be dragged and dropped into the editor. The options for the editor can be changed in the tiny-editor component.
2. For the video player i chose videogular. You can visit their website to know more, and coustomize the player at video-player component.
3. Using Ace-Editor as the code editor on the site. You can visit the ng2-ace-editor module page on npm website to know more. Add new languages or themes at code-editor component.

**Security**

User authentication is through JWTs and passport's JWT Strategy. All routes have been secured on the server code. Please ensure while adding anything new, the users role is always checked at the server.
The users have been divided into three roles - 'user', 'Admin', 'Content-Manager', with their own set of rights to manage content and users.

**Installation**

1. Go the the angular-src folder. Run npm install to install all dependencies. Similarly install dependencies in the root folder with npm install. Install dependencies in the codecraft-judge folder too.
2. Make changes to any of the componenents if you like.
3. Now to configure the server. Start your mongodb server. Make a database by codecraft, and make a user with read and write capabilities on the database.
4. Go to the database.js file in config folder. Here set the url to your database, with authentication details in the url. Also set your secret. A secret is basically a key which is used to generate your 
jwt auth tokens. Do not share the information in this config file with anyone.
5. Then go to the server.js file in the same folder. Currently set the production mode to false, and set the port in which you want the server to run.
6. Go to the main.service.ts file in angular-src/src/app/services/main.service.ts. Here set your server address e.g- 192.168.133.89:3000.
7. Now we can run the app. To test in development mode, run the standard ng serve command, and run app.js file in the root folder to start the server.
8. First, create a user for the admin. Once registers, go to the mongodb database, search user and set his role to 'Admin'. Now the admin has
all the rights. He can make new content managers by visiting users profiles. You will get to know all the features as you explore the site.
9. Once ready for production, run ng build --prod. This will create a public folder in the root folder.
10. Change productionMode to true in the server.js file.

Thats it. now the site is up and running. 

***Go through README.md in codecraft-judge to set up the judge***

**Imp Notes**

1. Do not share your secret or database auth details with anyone.
2. When going back to dev mode, with ng build, make a backup of the asset folder, as it is deleted. Then, when back in prod mode, replace the asset folder with old asset folder.
3. Now sources can be added by Content Managers and admins, in the /addSource route.
