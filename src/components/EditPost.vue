<template>
  <div class="edit-post">
    <h1>Edit Post</h1>
    <form @submit.prevent="saveChanges">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" v-model="content" required></textarea>
      </div>
      <button type="submit">Save</button>
      <button type="button" @click="$emit('cancelled')">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    post: Object,
  },
  data() {
    return {
      title: this.post.title,
      content: this.post.content,
    };
  },
  methods: {
    async saveChanges() {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/posts/${this.post.slug}`, {
          title: this.title,
          content: this.content,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.$router.push('/posts');
      } catch (error) {
        console.error('Error updating post:', error);
      }
    },
  },
};
</script>



<style scoped>
.edit-post {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-family: 'Ubuntu', sans-serif;
  color: #c38383;
  font-size: 2em;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-family: 'Ubuntu', sans-serif;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Ubuntu', sans-serif;
}

button {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Ubuntu', sans-serif;
  margin-top: 15px;
}

button:hover {
  background-color: #555;
}
</style>
