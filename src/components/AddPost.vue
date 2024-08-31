<template>
  <div class="add-post-card">
    <h2>Create New Post</h2>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div class="form-group">
        <label for="content">Content:</label>
        <textarea id="content" v-model="content" required></textarea>
      </div>
      <div class="form-group">
        <label for="image">Upload Image:</label>
        <input type="file" id="image" @change="handleImageUpload" />
      </div>
      <div class="button-group">
        <button type="submit" class="submit-button">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddPost',
  data() {
    return {
      title: '',
      content: '',
      image: null,  
    };
  },
  methods: {
    handleImageUpload(event) {
      this.image = event.target.files[0]; 
    },
    async submitPost() {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('content', this.content);
      if (this.image) {
        formData.append('image', this.image); 
      }

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data', 
          },
        });
        this.$emit('post-created');
        this.title = '';
        this.content = '';
        this.image = null;
      } catch (error) {
        console.error('Error creating post:', error);
      }
    },
  },
};
</script>

<style scoped>
.add-post-card {
  max-width: 500px; 
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-family: 'Roboto', sans-serif;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
}

textarea {
  resize: vertical;
  height: 100px;
}

.button-group {
  display: flex;
  justify-content: flex-end; 
  margin-top: 20px;
}

.submit-button {
  background-color: #c38383;
  color: white;
  padding: 8px 16px;
  font-size: 0.9em; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #c82333;
}
</style>
