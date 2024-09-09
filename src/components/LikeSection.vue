<template>
  <div class="like-section">
    <button class="like-button" @click="toggleLike">
      <span :class="{ liked: isLiked }">&#10084;</span> <!-- Heart Icon -->
    </button>
    <span>{{ likesCount }}</span>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    postSlug: {
      type: String,
      required: true,
    },
    initialLikesCount: {
      type: Number,
      default: 0,
    },
    likedByUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLiked: this.likedByUser,
      likesCount: this.initialLikesCount,
    };
  },
  methods: {
    async toggleLike() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts/like/${this.postSlug}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        this.$emit('like-toggled');
        this.isLiked = !this.isLiked; // Toggle the like state
        this.likesCount += this.isLiked ? 1 : -1; // Adjust the likes count accordingly
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },
  },
};
</script>

<style scoped>
.like-section {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.like-button {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  padding: 5px;
}

.like-button .liked {
  color: red;
}

.like-button span {
  transition: color 0.3s, opacity 0.3s;
  opacity: 1;
}

.like-button:hover span {
  opacity: 0.5;
}

.like-button:hover {
  background: transparent;
}
</style>
