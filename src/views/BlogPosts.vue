<template>
  <div class="blog-posts">
    <h1>Blog Posts</h1>
    <input type="text" v-model="searchQuery" placeholder="Search posts..." class="search-bar" />
    <div class="sorting-options">
        <label for="sort">Sort by:</label>
        <select v-model="sortOrder" @change="fetchPosts(1,sortOrder)">
         <option value="asc">Oldest</option>
         <option value="desc">Newest</option>
       </select>
      </div>
    <div v-if="!isLoggedIn">
      <router-link to="/login">Login</router-link>
    </div>
    <div v-else>
      <div class="button-wrapper">
        <button @click="toggleAddPostForm" class="create-post-button">
          {{ showAddPostForm ? "Cancel" : "Create New Post" }}
        </button>
      </div>

      <div v-if="showAddPostForm" class="add-post-form">
        <AddPost @post-created="fetchPosts" />
      </div>

      <div v-if="Posts.length === 0">
        <p>No posts available.</p>
      </div>
      <div v-else class="post-grid">
        <div v-for="post in Posts" :key="post.slug" class="post-card">
          <img :src="post.image || defaultImage" alt="Post image" class="post-img" />
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-author">Author: {{ post.user.name }}</p>
          <div class="post-actions">
            <router-link :to="`/posts/${post.slug}`" class="post-link">
              <button class="view-post-button">View Post</button>
            </router-link>
            <button v-if="isAuthor(post)" @click="confirmDelete(post.slug)" class="delete-post-button">Delete Post</button>
            <div class="icons-container">
              <div class="like-section">
                <LikeSection
                  :postSlug="post.slug"
                  :initialLikesCount="post.likes_count"
                  :likedByUser="post.liked_by_user"
                />
              </div>
              <div class="comment-section">
                <span class="comment-icon">&#128172;</span> 
                <span class="comment-count">{{ post.comments_count }}</span>
              </div>
            </div>
            <hr>
            <span v-if="post.last_comment" class="last-comment">Latest: {{ post.last_comment.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      :currentPage="meta.current_page"
      :lastPage="meta.last_page"
      @page-changed="fetchPosts"
    />
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this post?</p>
        <button @click="deletePost">Yes, Delete</button>
        <button @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import AddPost from '../components/AddPost.vue'; 
import Pagination from '../components/Pagination.vue';
import LikeSection from '../components/LikeSection.vue';
import defaultImage from '../assets/default.jpg';
import _ from 'lodash';

export default {
  props: {
    comments_count: {
      type: Number,
      default: 0,
    },
  },
  name: 'BlogPosts',
  components: {
    AddPost,
    Pagination,
    LikeSection,
  },
  data() {
    return {
      posts: [],
      isLoggedIn: false,
      showAddPostForm: false, 
      meta: {},
      searchQuery: '',
      postToDelete: null,
      showDeleteModal: false,
      defaultImage,
      sortOrder: 'desc',
    };
  },
  watch: {              
    searchQuery: _.debounce(function() {
      this.fetchPosts();
    }, 500),
  },
  computed: {
    Posts() {
      if (!this.searchQuery) return this.posts;
      const lowercasedQuery = this.searchQuery.toLowerCase();
      return this.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowercasedQuery) ||
          (post.description && post.description.toLowerCase().includes(lowercasedQuery))
      );
    },
  },
  async created() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    if (this.isLoggedIn) {
      this.fetchPosts();
    }
  },
  methods: {
    isAuthor(post) {
      const userId = localStorage.getItem('userId');
      return post.user.id === Number(userId);
    },
    toggleAddPostForm() {
      this.showAddPostForm = !this.showAddPostForm;
    },
    async fetchPosts(page = 1, sort = 'desc') {
      this.currentPage = page;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
          params: {
            page: page,
            search: this.searchQuery,           // Include the search query here
           sort: sort,      // Add sorting parameter
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.posts = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        console.error('Error fetching posts:', error);
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
        this.fetchPosts(this.currentPage);
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
.blog-posts {
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

.post-title {
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
.search-bar {
  width: 300px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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