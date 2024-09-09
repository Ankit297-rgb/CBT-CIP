document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('blog-form');
    const blogsContainer = document.getElementById('blogs-container');
    
    // Load existing blogs from local storage
    const loadBlogs = () => {
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        blogsContainer.innerHTML = blogs.map(blog => `
            <div class="blog-post" data-id="${blog.id}">
                ${blog.image ? `<img src="${blog.image}" alt="Blog Image">` : ''}
                <h2>${blog.title}</h2>
                <p class="content">${blog.post}</p>
                <p class="author">by ${blog.author}</p>
                <div class="likes-comments">
                    <button class="like-btn" data-liked="${blog.liked ? 'true' : 'false'}">
                        ${blog.liked ? 'Unlike' : 'Like'} (${blog.likes || 0})
                    </button>
                    <button class="comment-btn">Comment</button>
                </div>
                <div class="comments">
                    ${blog.comments ? blog.comments.map(comment => `
                        <div class="comment">
                            <p><strong>${comment.name}:</strong> ${comment.text}</p>
                        </div>
                    `).join('') : ''}
                </div>
                <div class="comment-form" style="display: none;">
                    <input type="text" class="comment-author" placeholder="Your Name" required>
                    <textarea class="comment-text" placeholder="Write a comment..." required></textarea>
                    <button class="submit-comment">Submit Comment</button>
                </div>
            </div>
        `).join('');
    };

    loadBlogs();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const post = document.getElementById('post').value;
        const author = document.getElementById('author').value;
        const imageFile = document.getElementById('image').files[0];

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;

            const newBlog = {
                id: Date.now(),
                title,
                post,
                author,
                image: imageUrl,
                likes: 0,
                liked: false,
                comments: []
            };

            const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
            blogs.push(newBlog);
            localStorage.setItem('blogs', JSON.stringify(blogs));

            form.reset();
            loadBlogs();
        };
        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            reader.onload({ target: { result: '' } });
        }
    });

    blogsContainer.addEventListener('click', (e) => {
        const blogElement = e.target.closest('.blog-post');
        const blogId = blogElement.getAttribute('data-id');
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const blog = blogs.find(b => b.id == blogId);

        if (e.target.classList.contains('like-btn')) {
            blog.liked = !blog.liked;
            blog.likes += blog.liked ? 1 : -1;
            e.target.textContent = `${blog.liked ? 'Unlike' : 'Like'} (${blog.likes})`;
            e.target.setAttribute('data-liked', blog.liked ? 'true' : 'false');
            localStorage.setItem('blogs', JSON.stringify(blogs));
        }

        if (e.target.classList.contains('comment-btn')) {
            const commentForm = blogElement.querySelector('.comment-form');
            commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
        }

        if (e.target.classList.contains('submit-comment')) {
            const commentAuthor = blogElement.querySelector('.comment-author').value;
            const commentText = blogElement.querySelector('.comment-text').value;

            if (commentAuthor && commentText) {
                blog.comments.push({ name: commentAuthor, text: commentText });
                localStorage.setItem('blogs', JSON.stringify(blogs));
                loadBlogs();
            } else {
                alert('Please enter your name and comment text.');
            }
        }
    });
});
