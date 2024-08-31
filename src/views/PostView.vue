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

export default {
  name: 'PostDetails',
  components: {
    EditPost,
    CommentSection,
  },
  data() {
    return {
      post: null,
      isEditing: false,
      isPostAuthor: false,
      showDeleteModal: false,
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
