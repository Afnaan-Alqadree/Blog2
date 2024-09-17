<template>
  <div class="comments">
    <h2>Comments</h2>
    <div v-if="comments.length === 0">
      <p>No comments yet.</p>
    </div>
    <div v-else>
      <ReplyComponent
        v-for="comment in sortedComments"
        :key="comment.id"
        :comment="comment"
        :post="post"
        @refresh-comments="fetchComments"
      />
    </div>
    <div class="add-comment">
      <form @submit.prevent="addComment">
        <textarea v-model="newComment" placeholder="Add a comment.." class="comment-textarea" required ></textarea>
        <button class="comment-btn" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ReplyComponent from './ReplyComponent.vue';

export default {
  components: {
    ReplyComponent,
  },
  props: {
    post: Object,
  },
  data() {
    return {
      newComment: '',
      loading: true,
    };
  },
  computed: {
    sortedComments() {
      return this.comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    comments() {
      return this.post ? this.post.comments : [];
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
  },
};
</script>

<style scoped>
.comments {
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


.add-comment {
  margin-top: 20px;
}

.comment-textarea {
  width: 100%;
  height: 60px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.comment-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.comment-btn:hover {
  background-color: #2980b9;
}
</style>
