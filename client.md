Task Sheet: Implementing a Comment System with MERN Stack
Overview
You are tasked with building a comment system using the MERN stack (MongoDB, Express.js, React.js, and Node.js) with JWT authentication. The comment system should allow authenticated users to view, add, like, and dislike comments on a specific page.
Requirements
Front-end
Use React.js to create a user interface that displays comments and allows users to add, like, and dislike comments.
Use a state management library such as Redux or React Context API to manage the state of the application.
Use React Router to handle navigation between different pages.
Implement validation to ensure that users can only add comments if they are authenticated.
Implement a validation that ensures that only authorized users can edit or delete their own comments.
Implement a validation that ensures that a user can only like or dislike a comment once.
Implement sorting by most liked, most disliked, and newest comments.
Implement pagination to limit the number of comments displayed on the page.
Implement real-time updates using WebSockets or another similar technology (big bonus and recommended to achieve but not mandatory).
Add a feature to allow users to reply to comments (optional).
Back-end
Use Node.js and Express.js to create a RESTful API that handles requests from the front-end.
Use MongoDB to store the comments and user data.
Use JWT authentication to allow only authenticated users to access the comment page and add comments.
Implement validation to ensure that users can only add comments if they are authenticated.
Implement a validation that ensures that only authorized users can edit or delete their own comments.
Implement a validation that ensures that a user can only like or dislike a comment once.
Implement sorting by most liked, most disliked, and newest comments.
Implement pagination to limit the number of comments displayed on the page.
Implement real-time updates using WebSockets or another similar technology (big bonus and recommended to achieve but not mandatory).
Add a feature to allow users to reply to comments (optional).
Technical requirements
Front-end
Use React.js and modern JavaScript features.
Use a state management library such as Redux or React Context API to manage the state of the application.
Use React Router to handle navigation between different pages.
Use axios or fetch to handle HTTP requests from the front-end to the back-end.
Use a CSS preprocessor such as Sass or Less to write CSS.
Use a component-based architecture to create reusable and modular UI components.
Use a responsive design to ensure the application works well on different screen sizes.
Back-end
Use Node.js and Express.js to create a RESTful API.
Use MongoDB to store the comments and user data.
Use JWT authentication to allow only authenticated users to access the comment page and add comments.
Use a data access layer to interact with the MongoDB database.
Use a service layer to handle business logic and data validation.
Use a modular architecture to create reusable and scalable components.
Use a middleware layer to handle authentication and authorization.
Version Control and Database Hosting
To ensure proper code management and easy access to the database, we recommend that you use Github for version control and MongoDB Atlas for database hosting.
When using Github, please make sure to commit your code regularly with clear commit messages that explain the changes you've made. This will help you keep track of your progress and make it easier for others to understand the code.
When using MongoDB Atlas, make sure that you configure your database to allow access from all IPs. This is important to ensure that your application is accessible from any location and that your team members can easily access the database when needed.
In addition, you should ensure that any sensitive information such as API keys, secrets, and passwords are stored securely and not checked into Github. You can use environment variables or a .env file to manage these securely.

Deliverables
A functional comment system that meets the requirements outlined above.
A README.md file that explains how to install and run the application.
Code that is well-structured, documented and follows best practices.
A deployed version of the application (optional).
Evaluation criteria
Functionality: Does the comment system meet the requirements outlined above?
Code quality: Is the code well-structured, documented, and follows best practices?
User interface: Is the user interface intuitive and easy to use?
Authentication: Does the system correctly authenticate users and restrict access to authorized users?
Validation: Does the system correctly
validate user input and prevent invalid data from being stored in the database?
Scalability: Is the system modular and designed to be scalable? (optional)
Performance: Does the system perform well, even with many comments?
Security: Is the system secure and protected against common security threats?
Bonus features: Are any optional features, such as real-time updates or comment replies, implemented well? (optional)
Resources
Here are some resources that may be helpful as you work on this task:
React.js documentation
React Router documentation
Redux documentation
Express.js documentation
MongoDB documentation
JWT authentication with Node.js
RESTful API design best practices
WebSocket documentation

Notes
Please send us the git repo link that has public access. And also please ensure that we properly have access to the .env file or your environment variables.
Conclusion
Implementing a comment system with MERN stack is a challenging task that requires strong skills in both front-end and back-end development. However, with careful planning and attention to detail, you can create a functional and scalable comment system that meets the requirements of the task. Good luck!
