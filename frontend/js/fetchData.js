const showloggedusername=() =>{
    const userNameElement = document.getElementById('logged-username');
    //find username from localstorage
    let user =localStorage.getItem('loggedInUser');
    if (user){
       user= JSON.parse(user);
   }
   
    //show user name in the page
  
  // userNameElement.innerText=user.userName;
  
   };
  
  const showLoggedUsername = () => {
      const userNameElement = document.getElementById('logged-username');
      
      // Retrieve the user object from localStorage
      let user = localStorage.getItem('loggedInUser');
      
      if (user) {
          // Parse the JSON string into a JavaScript object
          user = JSON.parse(user);
          
          // Show the username on the page
          if (userNameElement && user.userName) {
              userNameElement.innerText = user.userName;
          } else {
              console.error("Username element or userName not found");
          }
      } else {
          console.error("No logged-in user found in localStorage");
      }
  };
  
   const checkloggedinuser =()=>{
      let user=localStorage.getItem('loggedinuser');
  
      if (user) {
          // Parse the JSON string into a JavaScript object
          user = JSON.parse(user);
          
  
      }
  
      else{
          window.location.href = "/index.html";
      }
  
   }
  
  
    const logout=() =>{
    //clearing the localhost
       localStorage.clear();
       checkloggedinuser();
    };


// Function to fetch all posts from the server
const fetchAllPosts = async () => {
  let data; // Variable to store fetched data
  try {
      // Fetching data from the server
      const res = await fetch("http://localhost:5000/getAllPosts");
      // Parsing the response as JSON
      data = await res.json();
      console.log(data); // Logging the fetched data
      showAllPosts(data); // Displaying all posts
  } catch (err) {
      // Error handling in case the fetch operation fails
      console.log("Error fetching data from server:", err);
  }
};

// Function to fetch all comments of a specific post
const fetchAllCommentsOfAPost = async (postId) => {
  let commentsOfPost = []; // Array to store fetched comments
  try {
      // Fetching comments from the server based on post ID
      const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
      commentsOfPost = await res.json(); // Parsing the response as JSON
  } catch (err) {
      // Error handling in case the fetch operation fails
      console.log("Error fetching comments from the server:", err);
  } finally {
      console.log(commentsOfPost);
      return commentsOfPost; // Returning the fetched comments
  }
};

// Function to display all posts in the UI
const showAllPosts = (allPosts) => {
  const postContainer = document.getElementById("post-container"); // Getting the post container element
  postContainer.innerHTML = ""; // Clearing the container before adding new posts

  // Loop through each post and display it
  allPosts.forEach(async (post) => {
      const postDiv = document.createElement('div'); // Creating a div for each post
      postDiv.classList.add('post'); // Adding a class to the div

      // Adding HTML content to the post div
      postDiv.innerHTML = `
          <div class="post-header">
              <div class="post-user-image">
                  <img src=${post.postedImage} alt="User Image"/>
              </div>
              <div class="post-username-time">
                  <p class="post-username">${post.postedUserName}</p>
                  <div class="posted-time">
                      <span>${timedifference(`${post.postedTime}`)}</span>
                      <span> ago</span>
                  </div>
              </div>
          </div>
          <div class="post-text">
              <p class="post-text-content">
                  ${post.postText}
              </p>
              <div class="post-image">
                  <img src=${post.postImageUrl} alt="Post Image"/>
              </div>
          </div>
      `;
      postContainer.appendChild(postDiv); // Appending the post div to the container

      // Fetching comments for each post
      let postComments = await fetchAllCommentsOfAPost(post.postId);
      postComments.forEach((comment) => {
          const commentsHolderDiv = document.createElement("div");
          commentsHolderDiv.classList.add("comments-holder");

          commentsHolderDiv.innerHTML = `
              <div class="comment">
                  <div class="comment-user-image">
                     <img src=${comment.commentedImage} alt="Comment User Image"/>
                 </div>
                 <div class="comment-text-container">
                     <h4>${comment.commentedUserName}</h4>
                     <p class="commented-text">${comment.commentText}</p>
                 </div>
              </div>
          `;
          postDiv.appendChild(commentsHolderDiv);
      });

      // Adding new comment section to each post
      const addNewCommentDiv = document.createElement('div');
      addNewCommentDiv.classList.add("postcomments-holder");
      addNewCommentDiv.innerHTML = `
          <div class="post-comment-input-field-holder">
              <input
                  type="text"
                  placeholder="POST YOUR COMMENT"
                  class="postcomment-field-holder"
                  id="postcomment-input-for-postId-${post.postId}"
              />
          </div>
          <div class="comment-btn-holder">
              <button onclick="handlePostComment(${post.postId})" id="comment-btn" class="postcomment-btn">Comment</button>
          </div>
      `;
      postDiv.appendChild(addNewCommentDiv);
  });
};

// Function to handle posting a comment
const handleNewComment = async (postId) => {
  // Collecting logged-in user info from localStorage
  let user = localStorage.getItem('loggedInUser');
  if (user) {
      user = JSON.parse(user);
  }

  const commentedUserID = user ?.userId;

  // Getting comment text from input
  const commentTextElement = document.getElementById(`postcomment-input-for-postId-${postId}`);
  const commentText = commentTextElement.value;

  // Current time of the comment
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const timeOfComment = now.toISOString();

  const commentObject = {
      commentOfPostId: postId,
      commentedUserID: commentedUserID,
      commentText: commentText,
      commentTime: timeOfComment,
  };

  try {
      const res = await fetch("http://localhost:5000/addNewPost", {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(commentObject),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const data = await res.json();
      console.log('Comment posted:', data);
  } catch (err) {
      console.error('Error:', err);
  }
};




 const handleAddNewPost=()=>{
   //getting user id
   let user = localStorage.getItem('loggedInUser');
   if (user) {
       user = JSON.parse(user);
  }

  const postedUserID = user.userId;

// current time
  let now = new Date();
  now.setMinutes(now.getMinutes() - 
  now.getTimezoneOffset());
  const timeOfpost = now.toISOString();
// post txt
const postTextElement =document.getElementById('newpost-text');
const postText=postTextElement.value;

const postImageElement =document.getElementById('newpostimage');
const postImageUrl = postImageElement.value;
//creating new post
const postObject = {

     postedUserID: postedUserIDUserID,
    postedTime: timeOfpost,
    postText:postText,
    postImageUrl:postImageUrl,

};

console.log (postObject);

 };

// Calling the function to fetch and display all posts
fetchAllPosts();
showLoggedUsername();