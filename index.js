const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const port = 5000; // Defining the port number

const app = express(); // Initializing the Express app

app.use(cors()); // Enabling CORS for cross-origin requests
app.use(express.json()); // Parsing JSON bodies in incoming requests

// Creating a connection to the MySQL server
let db = mysql.createConnection({
    host: 'localhost', // Database host
    user: 'root',      // Database username
    password: "",      // Database password (empty in this case)
    database: "postbook1" // Name of the database
});

// Connecting to the MySQL server
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        throw err; // Throwing an error if the connection fails
    } else {
        console.log("MySQL server connected...");
    }
});

// Route to get user information from the server
app.post("/getUserInfo", (req, res) => {
    console.log(req.body); // Logging the request body
    
    const { userId, password } = req.body; // Destructuring the userId and password from the request body

    // SQL query to fetch user information based on userId and password
    const getUserInfosql = `SELECT userId, userName, userImage FROM users WHERE userId = ? AND userPassword = ?`;

    // Executing the query
    db.query(getUserInfosql, [userId, password], (err, result) => {
        if (err) {
            console.error("Error getting user info from server:", err);
            res.status(500).send({ error: 'Error getting user info' });
        } else {
            res.send(result); // Sending the result back to the client
        }
    });
});

// Route to get all posts from the server
app.get("/getAllPosts", (req, res) => {
    // SQL query to fetch all posts with user information
    const sqlForAllPosts = `
        SELECT 
            users.userName AS postedUserName, 
            users.userImage AS postedImage, 
            post.postedTime, 
            post.postText, 
            post.postImageUrl, 
            post.postId 
        FROM post 
        INNER JOIN users ON post.postedUserId = users.userId 
        ORDER BY post.postedTime DESC
    `;

    // Executing the query
    db.query(sqlForAllPosts, (err, result) => {
        if (err) {
            console.error("Error loading all posts from database:", err);
            res.status(500).send({ error: 'Error loading posts' });
        } else {
            console.log(result); // Logging the result
            res.send(result); // Sending the result back to the client
        }
    });
});

// Route to get comments of a single post
app.get('/getAllComments/:postId', (req, res) => {
    const postId = req.params.postId; // Getting the postId from the request parameters

    // SQL query to fetch all comments for a specific post
    const sqlForAllComments = `
        SELECT 
            users.userName AS commentedUserName, 
            users.userImage AS commentedImage, 
            comments.commentId, 
            comments.commentOfPostId, 
            comments.commentText, 
            comments.commentTime 
        FROM comments 
        INNER JOIN users ON comments.commentedUserID = users.userId 
        WHERE comments.commentOfPostId = ?
    `;

    // Executing the query
    db.query(sqlForAllComments, [postId], (err, result) => {
        if (err) {
            console.error("Error fetching comments from the database:", err);
            res.status(500).send({ error: 'Error fetching comments' });
        } else {
            res.send(result); // Sending the result back to the client
        }
    });
});

// Route to add a new comment
app.post("/postComment", (req, res) => {
    const { commentOfPostId, commentedUserId, commentText, commentTime } = req.body;

    // SQL query for adding a new comment
    const sqlForAddingNewComment = `
        INSERT INTO comments (commentId, commentOfPostId, commentedUserID, commentText, commentTime) 
        VALUES (NULL,?,?,?,?)`;
    

    // Execute the query
    db.query(sqlForAddingNewComment, [commentOfPostId, commentedUserId, commentText, commentTime], (err, result) => {
        if (err) {
            console.error("Error adding comment to the database:", err);
            res.status(500).send({ error: 'Error adding comment' });
        } else {
            res.status(201).send(result); // Send the result back with status 201 Created
        }
    });
});


app.post("/.addNewPost",(req,res) =>{
     const{postedUserID, postedTime,postText,postImageUrl}=req.body;


let sqlForAddingNewPost= `INSERT INTO post (postId, postedUserId, postedTime, postText, postImageUrl) VALUES (NULL,?, ?, ?, ?)`;

   let query =db.query(sqlForAddingNewPost,[postedUserID,postedTime,postText,postImageUrl]);(err,result)=>{
    if (err) {
        console.error("Error adding new post to the database:", err);
        res.status(500).send({ error: 'Error adding comment' });
    } else {
        res.status(201).send(result); // Send the result back with status 201 Created
    }
}
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
