import {
    getAllComents
} from "./comment.js"

export function createPost() {
    let cancelBtn = Array.from(document.getElementsByClassName("cancel"))[0];
    let postBtn = Array.from(document.getElementsByClassName("public"))[0];

    let topicForm = document.getElementById("postTopicForm");
    let topicsContainer = document.getElementById("topicsContainer");

    cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        topicForm.reset();
    })
    postBtn.addEventListener("click", function (e) {
        e.preventDefault();
        let postData = new FormData(topicForm);
        submitPost(postData);
        topicForm.reset();
    })


    function submitPost(postData) {
        let title = postData.get("topicName");
        let author = postData.get("username");
        let content = postData.get("postText");
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let timestamp = date + ' ' + time;
        if (title.length == 0 || author.length == 0 || content.length == 0) {
            return alert("All fields are mandatory!")
        }

        let postObj = {
            title,
            author,
            content,
            timestamp
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(postObj);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3030/jsonstore/collections/myboard/posts", requestOptions)
            .then(response => response.json())
            .then(result => visualisePost(result))
            .catch(error => console.log('error', error));
    }

    function visualisePost(post) {
        let newTopicDiv = document.createElement("div");
        newTopicDiv.className = "topic-container";
        newTopicDiv.id = post._id;
        newTopicDiv.innerHTML = `
      
        <div class="topic-name-wrapper">
            <div class="topic-name">
                <a href="#" class="normal">
                    <h2>${post.title}</h2>
                </a>
                <div class="columns">
                    <div>
                        <p>Date: <time>${post.timestamp}</time></p>
                        <div class="nick-name">
                            <p>Username: <span>${post.author}</span></p>
                        </div>
                    </div>
                    <div class="subscribers">
                        <!-- <button class="subscribe">Subscribe</button> -->
                        <p>Subscribers: <span>456</span></p>
                    </div>
                </div>
            </div>
        </div>  
        `
        let directToComments = newTopicDiv.querySelector("a");
        directToComments.addEventListener("click", function (e) {
            e.preventDefault();
            getAllComents(post)
        })

        topicsContainer.appendChild(newTopicDiv)

    }
}