<template>
  <div class="blog-posts">
    <h1>My Blog Posts</h1>
    <div v-if="!isLoggedIn">
     <router-link to="/login"/>
    </div>
    <div v-else>
      <button @click="toggleAddPostForm" class="create-post-button">
        {{ showAddPostForm ? "Cancel" : "Create New Post" }}
      </button>

      <div v-if="showAddPostForm" class="add-post-form">
        <AddPost @post-created="fetchPosts" />
      </div>

      <div v-if="posts.length === 0">
        <p>No posts available.</p>
      </div>
      <div v-else class="post-grid">
        <div v-for="post in posts" :key="post.slug" class="post-card">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-author">Author: {{ post.user.name }}</p>
          <router-link :to="`/posts/${post.slug}`" class="post-link">
            <button>View Details</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AddPost from '../components/AddPost.vue'; 

export default {
  name: 'BlogPosts',
  components: {
    AddPost,
  },
  data() {
    return {
      posts: [],
      isLoggedIn: false,
      showAddPostForm: false, 
    };
  },
  async created() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    if (this.isLoggedIn) {
      this.fetchPosts();
    }
  },
  methods: {
    toggleAddPostForm() {
      this.showAddPostForm = !this.showAddPostForm;
    },
    async fetchPosts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.posts = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
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

.create-post-button {
  margin-bottom: 20px;
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
</style>
