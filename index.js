import axios from "https://cdn.skypack.dev/axios";

let posts = [];

const getPosts = async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    posts = response.data;
    console.log(posts);
    displayPosts(posts);
  } catch (error) {
    console.error("fetch error: ", error);
  }
};

const displayPosts = (posts) => {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  const postsToDisplay = posts;

  postsToDisplay.forEach((post) => {
    const card = document.createElement("div");
    card.className = "posts-card";
    card.innerHTML = `
        <div class = "post-content" onclick = "showComments(${post.id})">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>      
        <div class = "deleteButtonContainer" >      
            <button id = "deleteButton" onclick="openConfirmModal(${post.id})">Delete</button>
        </div>
    `;
    postsContainer.appendChild(card);
  });
};

const showComments = async (postId) => {
  try {
    const commentsContainer = document.getElementById("commentsContainer");
    commentsContainer.innerHTML = "";
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    const comments = response.data;
    // Show the modal
    commentsContainer.style.display = "block";

    const commentsModal = document.createElement("div");
    commentsModal.className = "modal-content";
    commentsModal.innerHTML = `
        <span class="close" onclick="closeCommentsModal()">&times;</span>
        <h2>Comments</h2>
        <ul id="commentList"></ul>
    `;

    commentsContainer.append(commentsModal);
    // Display comments in the modal
    const commentList = document.getElementById("commentList");
    commentList.className = "comments-list";
    comments.forEach((comment, index) => {
      const listItem = document.createElement("li");
      const isLastComment = index === comments.length - 1;

      listItem.innerHTML = `
         <div id="listItem"> 
            <strong>${comment.name}</strong>: ${comment.body}
         </div>
         ${!isLastComment ? "<hr />" : ""}
       `;
      commentList.appendChild(listItem);
    });

    console.log(comments);
  } catch (error) {
    console.error("fetch error: ", error);
  }
};

const openConfirmModal = (postId) => {
  const modalContainer = document.getElementById("confirmModal");
  modalContainer.style.display = "block"; // Show the modal

  modalContainer.innerHTML = `
      <div class="confirm-modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <p>Do you want to delete this post?</p>
        <div id="closeModelButtons"> 
            <button style = "margin-right: 20px" onclick="deletePost(${postId})">Delete</button>
            <button onclick="closeModal()">Cancel</button>
        </div>
      </div>
    `;
};

const closeModal = async () => {
  const modalContainer = document.getElementById("confirmModal");
  modalContainer.style.display = "none"; // hide the modal
  displayPosts(posts);
};

const closeCommentsModal = async () => {
  const commentsContainer = document.getElementById("commentsContainer");
  commentsContainer.style.display = "none";
  displayPosts(posts);
};

const deletePost = (postId) => {
  const index = posts.findIndex((post) => post.id === postId); // find the index of the model to be deleted
  if (index !== -1) {
    posts.splice(index, 1);
    closeModal();
  } else console.log("Post not found in the array!");
};

const filterPosts = () => {
  const filterInput = document.getElementById("filterInput");
  const filterValue = filterInput.value.toLowerCase();

  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(filterValue) ||
      post.body.toLowerCase().includes(filterValue)
    );
  });
  displayPosts(filteredPosts);
};

window.onload = function () {
  getPosts();
};
window.showComments = showComments;
window.openConfirmModal = openConfirmModal;
window.closeModal = closeModal;
window.deletePost = deletePost;
window.filterPosts = filterPosts;
window.closeCommentsModal = closeCommentsModal;
