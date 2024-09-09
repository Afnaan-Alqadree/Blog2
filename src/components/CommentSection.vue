<template>
  <div class="comment-section">
    <h2>Comments</h2>
    <div v-if="comments.length === 0">
      <p>No comments yet.</p>
    </div>
    <div v-else>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <strong>{{ comment.user.name }}:</strong>
        </div>
        <div v-if="editingCommentId === comment.id">
          <textarea v-model="editingCommentContent" required></textarea>
          <button @click="updateComment(comment.id)">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </div>
        <div v-else>
          <p>{{ comment.content }}</p>
          <div class="comment-actions">
            <button v-if="isCommentAuthor(comment)" @click="startEdit(comment.id, comment.content)">Edit</button>
            <button v-if="isCommentAuthor(comment) || isPostAuthor()" @click="confirmDelete(comment.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="addComment">
      <textarea v-model="newComment" placeholder="Add a comment..." required></textarea>
      <button type="submit">Submit</button>
    </form>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this comment?</p>
        <button @click="deleteComment(confirmedDeleteId)">Yes</button>
        <button @click="cancelDelete">Cancel</button>
      </div>
    </div>
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
      newComment: '',
      loading: true,
      editingCommentId: null,
      editingCommentContent: '',
      showDeleteModal: false,
      confirmedDeleteId: null,
    };
  },
  computed: {
    comments() {
      return this.post ? this.post.comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
    },
  },
  
  methods: {
    async fetchComments() {
      try {
        this.loading = true;
        await this.$emit('refresh-comments'); 
      } finally {
        this.loading = false;
      }
    },
    async addComment() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts/${this.post.slug}/comments`, {
          content: this.newComment,
          //returning Parentid
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.newComment = '';
        await this.fetchComments();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    startEdit(commentId, content) {
      this.editingCommentId = commentId;
      this.editingCommentContent = content;
    },
    async updateComment(commentId) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/posts/${this.post.slug}/comments/${commentId}`, {
          content: this.editingCommentContent,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.editingCommentId = null;
        this.editingCommentContent = '';
        await this.fetchComments();
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    },
    cancelEdit() {
      this.editingCommentId = null;
      this.editingCommentContent = '';
    },
    confirmDelete(commentId) {
      this.confirmedDeleteId = commentId;
      this.showDeleteModal = true;
    },
    async deleteComment(commentId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${this.post.slug}/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.showDeleteModal = false;
        this.confirmedDeleteId = null;
        await this.fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    },
      cancelDelete() {
        this.showDeleteModal = false;
        this.confirmedDeleteId = null;
      },
      isCommentAuthor(comment) {
        const loggedInUserId = localStorage.getItem('userId');
        return comment.user.id === parseInt(loggedInUserId);
      },
    isPostAuthor() {
      const loggedInUserId = localStorage.getItem('userId');
      return this.post && this.post.user.id === parseInt(loggedInUserId);
    },
  },
};
</script>

<style scoped>
.comment-section {
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

h2 {
  font-family: 'Roboto', sans-serif;
  color: #c38383;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.comment-item {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-text {
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-header strong {
  font-size: 1.1em;
}
.comment-actions {
  margin-top: 10px;
}

.comment-actions button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #74b3f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Ubuntu', sans-serif;
}

.comment-actions button:hover {
  background-color: #0056b3;
}
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 10px;
  resize: vertical;
}

button {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Ubuntu', sans-serif;
}

button:hover {
  background-color: #555;
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
