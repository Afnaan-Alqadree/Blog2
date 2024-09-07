<template>
  <div class="post-details">
    <div class="button1">
      <button @click="$router.push('/posts')">Back to Posts</button>
    </div>
    <div v-if="!isEditing && post">
      <h1>{{ post.title }}</h1>
       
      <div v-if="post.image" class="post-image">
        <img :src="post.image" :alt="post.title" />
      </div>
      
      <div class="post-content" v-html="post.content"></div>
      
      <div class="post-actions">
        <button v-if="isPostAuthor" @click="enableEditMode">Edit</button>
        <button v-if="isPostAuthor" @click="confirmDelete">Delete</button>
      </div>
      
      <div class="like-section">
        <LikeSection 
          :postSlug="post.slug" 
          :initialLikesCount="post.likes_count" 
          :likedByUser="post.liked_by_user"
          @like-toggled="fetchPost" 
        />
        <button @click="toggleLikesList" class="likes-list-btn">
          {{ showLikesList ? 'Hide Likes' : 'Show Likes' }}
        </button>
        <div v-if="showLikesList" class="likes-list">
          <ul>
            <li v-for="user in post.likes" :key="user.id">{{ user.name }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <EditPost v-if="isEditing" :post="post" @saved="exitEditMode" @cancelled="exitEditMode" />
    <CommentSection v-if="post" :post="post" @refresh-comments="fetchPost" />

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
import EditPost from '../components/EditPost.vue';
import CommentSection from '../components/CommentSection.vue';
import LikeSection from '../components/LikeSection.vue';
export default {
  name: 'PostDetails',
  components: {
    EditPost,
    CommentSection,
    LikeSection,
  },
  data() {
    return {
      post: null,
      isEditing: false,
      isPostAuthor: false,
      showDeleteModal: false,
      showLikesList: false,
    };
  },
  async created() {
    await this.fetchPost();
  },
  methods: {
    async fetchPost() {
      const postSlug = this.$route.params.slug;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postSlug}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.post = response.data.data;
        const fetchedUserId = this.post.user.id;
        const localUserId = Number(localStorage.getItem('userId'));
        this.isPostAuthor = fetchedUserId === localUserId;
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    },
    async toggleLike() {
      const postSlug = this.post.slug;
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts/like/${postSlug}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        await this.fetchPost();
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    toggleLikesList() {
      this.showLikesList = !this.showLikesList;
    },
    enableEditMode() {
      this.isEditing = true;
    },
    exitEditMode() {
      this.isEditing = false;
    },
    confirmDelete() {
      this.showDeleteModal = true;
    },
    async deletePost() {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${this.post.slug}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.$router.push('/posts');
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        this.showDeleteModal = false;
      }
    },
    cancelDelete() {
      this.showDeleteModal = false;
    },
  },
};
</script>

<style scoped>
.post-details {
  padding: 20px;
}

.button1 {
  display: flex;
  justify-content: flex-end; 
}

h1 {
  font-family: 'Roboto', sans-serif;
  color: #c38383;
  font-size: 2em;
  margin-bottom: 20px;
}

.post-image img {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.post-content {
  font-family: 'Roboto', sans-serif;
  color: #333;
  line-height: 1.6;
}

.post-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Ubuntu', sans-serif;
}

button:first-of-type {
  background-color: #007bff;
  color: white;
}

button:first-of-type:hover {
  background-color: #0056b3;
}

button:last-of-type {
  background-color: #dc3545;
  color: white;
}

button:last-of-type:hover {
  background-color: #c82333;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.like-section button {
  background: none;
  border: none;
  padding: 0;
}

.like-icon {
  font-size: 1.5em;
  color: #e74c3c;
  cursor: pointer;
  transition: color 0.3s;
}

.like-icon.liked {
  color: #c0392b;
}

.like-count {
  font-size: 1em;
  color: #333;
}

.likes-list-btn {
  display: inline-block;
  background-color: #e74c3c !important; 
  color: #fff !important; 
  padding: 5px 10px !important; 
  border: none !important;
  border-radius: 4px !important; 
  cursor: pointer !important;
  font-size: 0.9em !important;
  text-decoration: none !important; 
  transition: background-color 0.3s, color 0.3s !important; 
}

.likes-list-btn:hover {
  background-color: #c0392b !important;
}

.likes-list {
  display: block;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.likes-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.likes-list li {
  font-size: 0.9em;
  color: #555;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.likes-list li:last-of-type {
  border-bottom: none;
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
