export function getAllComents(post) {
    let dynamicDiv = document.getElementById("dynamicDiv");
    dynamicDiv.innerHTML = "";
    dynamicDiv.style.display = "block";

    let postDiv = document.createElement("div");
    postDiv.className = "theme-title"
    postDiv.innerHTML = `

<div class="theme-name-wrapper">
    <div class="theme-name">
        <h2>${post.title}</h2>
        <p>Date: <time>${post.timestamp}</time></p>
    </div>
    <div class="subscribers">
        <p>Subscribers: <span>456</span></p>
        <!-- <button class="subscribe">Subscribe</button>
        <button class="unsubscribe">Unsubscribe</button> -->
    </div>

</div>
`
    dynamicDiv.appendChild(postDiv);
    //create comments container then fill it with comments
    let commentsContainerDiv = document.createElement("div");
    dynamicDiv.appendChild(commentsContainerDiv);
    renderComments();

    let submitCommentDiv = document.createElement("div");
    submitCommentDiv.className = "answer-comment"
    submitCommentDiv.innerHTML = `
<p><span>currentUser</span> comment:</p>
<div class="answer">
    <form>
        <textarea name="postText" id="comment" cols="30" rows="10"></textarea>
        <div>
            <label for="username">Username <span class="red">*</span></label>
            <input type="text" name="username" id="username">
        </div>
        <button>Post</button>
    </form>
</div>
`
    dynamicDiv.appendChild(submitCommentDiv);

    let postCommentBtn = submitCommentDiv.querySelector("button");
    let postCommentForm = submitCommentDiv.querySelector("form");
    postCommentBtn.addEventListener("click", function (e) {
        e.preventDefault();
        let commentData = new FormData(postCommentForm);
        postComment(commentData);

    })

    let mainContainer = document.querySelector(".container");
    mainContainer.style.display = "none";

    function postComment(comment) {
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let commTimestamp = date + ' ' + time;
        let content = comment.get("postText");
        let author = comment.get("username");

        let newComment = {
            author,
            commTimestamp,
            content,
            postId: post._id
        }

        if (author.length == 0 || content.length == 0) {
            return alert("Both fields are mandatory!")
        }
        postCommentForm.reset();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(newComment);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3030/jsonstore/collections/myboard/comments", requestOptions)
            .then(response => response.json())
            .then(result => renderComments())
            .catch(error => console.log('error', error));
    }

    function renderComments() {
        //get all comments
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://localhost:3030/jsonstore/collections/myboard/comments", requestOptions)
            .then(response => response.json())
            .then(result => filterComments(result))
            .catch(error => console.log('error', error));
    }

    function filterComments(d) {
        commentsContainerDiv.innerHTML = "";
        let coms = Object.values(d);

        let relevant = coms.filter(c => c.postId == post._id);
        relevant.forEach(c => {
            let commentDiv = document.createElement("div");
            commentDiv.className = "comment"
            commentDiv.innerHTML = `
    <header class="header">
        <p><span>${c.author}</span> posted on <time>${c.commTimestamp}</time></p>
    </header>
    <div class="comment-main">
        <div class="userdetails">
            <img src="./static/profile.png" alt="avatar">
        </div>
        <div class="post-content">
            <p>${c.content}</p>
        </div>
    </div>
    <div class="footer">
        <p><span>3</span> likes</p>
    </div>
`;
            commentsContainerDiv.appendChild(commentDiv)
        });
    }
}