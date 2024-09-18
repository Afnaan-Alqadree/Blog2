<template>
  <div class="My-posts">
    <h1>My Posts</h1>
    <div v-if="!isLoggedIn">
      <router-link to="/login">Login</router-link>
    </div>
    <div v-else>
      <div v-if="Posts.length === 0">
        <p>No posts available.</p>
      </div>
      <div v-else class="post-grid">
        <div v-for="post in Posts" :key="post.slug" class="post-card">
          <img :src="post.image || defaultImage" alt="Post image" class="post-img" />
          <h2 class="title">{{ post.title }}</h2>
          <p class="post-author">Author: {{ post.user.name }}</p>
          <div class="post-actions">
            <router-link :to="`/posts/${post.slug}`" class="post-link">
              <button class="view-post-button">View Post</button>
            </router-link>
            <button v-if="isAuthor(post)" @click="confirmDelete(post.slug)" class="delete-post-button">Delete Post</button>
          </div>
        </div>
      </div>
      <div class="comments-section">
        <h1>My Comments</h1>
        <div v-if="comments.length === 0">
          <p>No comments available.</p>
        </div>
       <div v-else class="comment-grid">
            <router-link v-for="comment in comments" 
                    :key="comment.id" 
                    :to="`/posts/${comment.post.slug}`" 
                    class="comment-card-link">
                <div class="comment-card">
                <p class="title">{{ comment.content }}</p>
                <p class="comment-info">
                    <span>On post: {{ comment.post.title }}</span>
                </p>
                </div>
            </router-link>
       </div>
    </div>
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this post?</p>
        <button @click="deletePost">Yes, Delete</button>
        <button @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </div>
</div> 
</template>

<script>
import axios from 'axios';
import defaultImage from '../assets/default.jpg';

export default {
  data() {
    return {
      posts: [],
      comments: [], 
      isLoggedIn: false,
      showDeleteModal: false,
      postToDelete: null,
      defaultImage,
      userId: null,
    };
  },
  computed: {
    Posts() {
      return this.posts.filter((post) => post.user.id === Number(this.userId));
    },
  },
  async created() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    if (this.isLoggedIn) {
      this.userId = localStorage.getItem('userId');
      await this.fetchPosts();
      await this.fetchComments(); 
    }
  },
  methods: {
    isAuthor(post) {
      return post.user.id === Number(this.userId);
    },
    async fetchPosts(page = 1, sort = 'desc') {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
          params: {
            sort: sort,
            page: page,
            user_id: userId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.posts = response.data.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    async fetchComments() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/comments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.comments = response.data.data; 
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    confirmDelete(postSlug) {
      this.postToDelete = postSlug;
      this.showDeleteModal = true;
    },
    async deletePost() {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${this.postToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        await this.fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        this.showDeleteModal = false;
        this.postToDelete = null;
      }
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.postToDelete = null;
    },
  },
};
</script>

<style scoped>
.My-posts {
  padding: 20px;
  background-color: #f1f1f1;
}

h1 {
  font-family: 'Ubuntu', sans-serif;
  color: #c38383;
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end; 
  margin-bottom: 20px;
}

.create-post-button {
  padding: 10px 20px;
  background-color: #c38383;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

.create-post-button:hover {
  background-color: #c82333;
}

.add-post-form {
  margin-bottom: 20px;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.post-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
}

.post-author {
  font-family: 'Roboto', sans-serif;
  color: #777;
  font-style: italic;
  margin-bottom: 15px;
}
.post-link {
  text-decoration: none;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  background-color: #c38383;
  color: white;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #c82333;
}
.icons-container {
  display: flex;
  align-items: center;
  gap: 10px; 
  margin-left: auto; 
}
.comment-icon {
  font-size: 1.0em;
  position: relative;
  top: 4px;
}
.comment-count {
  font-size: 1em;
  position: relative;
  top: 4px; 
}
.last-comment {
  font-size: 1em;
  color: #555;
  margin-left: 10px;
   margin-top: 10px;
}
.comments-section {
  padding: 20px;
  background-color: #f1f1f1;
  margin-top: 40px;
}

.comment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.comment-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.comment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.comment-content {
  font-family: 'Roboto', sans-serif;
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
}

.comment-info {
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  color: #777;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.comment-card-link {
  text-decoration: none;
  color: inherit;
}

.comment-card-link:hover .comment-card {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
  margin-top: 10px;
}

.modal-content button {
  margin: 10px;
}
</style>