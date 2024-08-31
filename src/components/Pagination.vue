<template>
  <div class="pagination">
    <button @click="changePage(1)" :disabled="currentPage === 1"><<<</button>
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"><</button>

    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: page === currentPage }"
    >
      {{ page }}
    </button>

    <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage">></button>
    <button @click="changePage(lastPage)" :disabled="currentPage === lastPage">>>></button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    lastPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    pages() {
      return Array.from({ length: this.lastPage }, (_, i) => i + 1);
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.lastPage) {
        this.$emit('page-changed', page); 
      }
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center; 
  gap: 5px;
  margin-top: 20px;
}

button {
  padding: 8px 12px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  background-color: #fff; 
  color: #c38383; 
  cursor: pointer;
  font-family: 'Roboto', sans-serif; 
  transition: background-color 0.3s, color 0.3s; 
}

button.active {
  font-weight: bold;
  background-color: #c38383; 
  color: white; 
}

button:hover {
  background-color: #f0e6e6; 
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: #f0f0f0; 
  color: #aaa; 
}
</style>

