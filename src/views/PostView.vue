<template>
  <div class="post-details">
    <div class="button1">
      <button @click="$router.push('/posts')">Back to Posts</button>
    </div>
    <div v-if="!isEditing && post">
      <h1>{{ post.title }}</h1>
      <div class="post-content" v-html="post.content"></div>
      <div class="post-actions">
        <button v-if="isPostAuthor" @click="enableEditMode">Edit</button>
        <button v-if="isPostAuthor" @click="deletePost(post.slug)">Delete</button>
      </div>
    </div>
    <EditPost v-if="isEditing" :post="post" @saved="exitEditMode" @cancelled="exitEditMode" />
    <CommentSection v-if="post" :post="post" @refresh-comments="fetchPost" />
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
        this.post = response.data;
        this.isPostAuthor = response.data.user.name === localStorage.getItem('userName');
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
    async deletePost(postSlug) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postSlug}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.$router.push('/posts');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
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
</style>
