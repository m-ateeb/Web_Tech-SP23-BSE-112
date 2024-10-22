const apiUrl = "https://usmanlive.com/wp-json/api/stories";
let currentPostId = null;

// Function to fetch and display all posts (Read)
function fetchPosts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById("posts-container");
            postsContainer.innerHTML = "";
            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
}

// Function to create a new post (Create)
function createPost() {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
    })
    .then(response => response.json())
    .then(post => {
        alert("Post created successfully!");
        fetchPosts();  // Refresh the list
    })
    .catch(error => console.error("Error creating post:", error));
}

// Function to edit a post (Prepopulate form for Update)
function editPost(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(post => {
            document.getElementById("title").value = post.title;
            document.getElementById("body").value = post.body;
            currentPostId = post.id;
            document.getElementById("submit-btn").style.display = "none";
            document.getElementById("update-btn").style.display = "block";
        })
        .catch(error => console.error("Error fetching post:", error));
}

// Function to update a post (Update)
function updatePost() {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    fetch(`${apiUrl}/${currentPostId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
    })
    .then(response => response.json())
    .then(post => {
        alert("Post updated successfully!");
        document.getElementById("submit-btn").style.display = "block";
        document.getElementById("update-btn").style.display = "none";
        fetchPosts();  // Refresh the list
        currentPostId = null;
    })
    .catch(error => console.error("Error updating post:", error));
}

// Function to delete a post (Delete)
function deletePost(id) {
    fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
    })
    .then(response => {
        if (response.ok) {
            alert("Post deleted successfully!");
            fetchPosts();  // Refresh the list
        } else {
            alert("Error deleting post");
        }
    })
    .catch(error => console.error("Error deleting post:", error));
}

// Fetch and display posts when the page loads
fetchPosts();
