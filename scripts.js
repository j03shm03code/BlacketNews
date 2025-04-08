const apiKey = '58f9ea2f63bf4206bd1a3c45b5f8075f';
const apiUrl = 'https://newsapi.org/v2/everything';
const adminUsername = 'J03SHM03';
const adminPassword = '1234567899Mp:)';
let loggedInUser = null;
let isAdmin = false;
let articles = [];

function toggleLoginRegister() {
    const form = document.getElementById('login-register-form');
    const loginRegisterBtn = document.getElementById('login-register-section').querySelector('button');
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        loginRegisterBtn.textContent = 'Close';
    } else {
        form.style.display = 'none';
        loginRegisterBtn.textContent = 'Login / Register';
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        alert('Registration successful!');
    } else {
        alert('Please fill out both fields.');
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === adminUsername && password === adminPassword) {
        loggedInUser = username;
        isAdmin = true;
        alert('Logged in as admin.');
        document.getElementById('admin-article-form').style.display = 'block';
    } else if (localStorage.getItem('username') === username && localStorage.getItem('password') === password) {
        loggedInUser = username;
        isAdmin = false;
        alert('Logged in as user.');
    } else {
        alert('Invalid login credentials.');
    }
    toggleLoginRegister();
}

function fetchNews() {
    const query = document.getElementById('search-query').value;
    const url = `${apiUrl}?q=${query}&apiKey=${apiKey}&pageSize=5`;
    
    axios.get(url)
        .then(response => {
            articles = response.data.articles;
            displayNews(articles);
        })
        .catch(error => {
            console.error('Error fetching the news:', error);
        });
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `
            <div>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
                ${isAdmin ? `
                    <button class="create-button" onclick="editArticle(${articles.indexOf(article)})">Edit</button>
                    <button class="create-button" onclick="deleteArticle(${articles.indexOf(article)})">Delete</button>
                ` : ''}
                <button class="like-button" onclick="likeArticle(${articles.indexOf(article)})">Like</button>
                <div class="comment-section">
                    <input type="text" placeholder="Add a comment" id="comment-${articles.indexOf(article)}" />
                    <button class="comment-button" onclick="addComment(${articles.indexOf(article)})">Comment</button>
                    <div id="comments-${articles.indexOf(article)}"></div>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function likeArticle(index) {
    const button = document.querySelectorAll('.like-button')[index];
    button.classList.toggle('liked');
}

function addComment(index) {
    const commentInput = document.getElementById(`comment-${index}`);
    const commentText = commentInput.value;
    if (commentText) {
        const commentsDiv = document.getElementById(`comments-${index}`);
        const newComment = document.createElement('div');
        newComment.classList.add('comment');
        newComment.textContent = `${loggedInUser}: ${commentText}`;
        commentsDiv.appendChild(newComment);
        commentInput.value = '';
    }
}

function editArticle(index) {
    const article = articles[index];
    alert(`Editing article: ${article.title}`);
    // Implement editing logic (e.g., show a form to edit)
}

function deleteArticle(index) {
    const article = articles[index];
    const confirmDelete = confirm(`Are you sure you want to delete: ${article.title}`);
    if (confirmDelete) {
        articles.splice(index, 1);
        displayNews(articles);
    }
}

function createArticle() {
    const title = document.getElementById('article-title').value;
    const description = document.getElementById('article-description').value;
    const content = document.getElementById('article-content').value;
    
    if (title && description && content) {
        const newArticle = {
            title: title,
            description: description,
            content: content,
            urlToImage: 'https://via.placeholder.com/300',
            url: '#',
        };
        articles.unshift(newArticle);
        displayNews(articles);
        alert('Article published!');
        
        document.getElementById('article-title').value = '';
        document.getElementById('article-description').value = '';
        document.getElementById('article-content').value = '';
    } else {
        alert('Please fill out all fields.');
    }
}