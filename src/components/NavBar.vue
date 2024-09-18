<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-logo">ThoughtCraft</router-link>
    <ul class="navbar-links">
      <li><router-link to="/posts">Blog</router-link></li>
      <li><router-link to="/MyProfile">My Profile</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <button v-if="isAuthenticated" @click="showLogoutConfirm = true" class="logout-button">Logout</button>
    </ul>

    <div v-if="showLogoutConfirm" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <button @click="logout">Yes</button>
        <button @click="showLogoutConfirm = false">Cancel</button>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      showLogoutConfirm: false,
      isAuthenticated: false,
    };
  },
  mounted(){
    if (localStorage.getItem('authToken'))
      this.isAuthenticated =true ;
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName'); 
      this.showLogoutConfirm = false; 
      this.isAuthenticated = false;
      this.$router.push('/'); 
    },
  }
};
</script>


<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #897f7f;
  color: white;
}

.navbar-logo {
  font-size: 1.5em;
  color: white; 
  text-decoration: none;
  padding: 3px;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.navbar-links li {
  margin: 0;
}

.navbar-links a {
  text-decoration: none;
  color: white;
  font-weight: bold;
}

.navbar-links a:hover {
  color: #ff6f61; 
}

.logout-button {
  padding: 8px 15px;
  background-color: #c38383;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

.logout-button:hover {
  background-color: #c82333;
}

/* Modal Styles */
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
  background: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
}

.modal-content h2 {
  margin: 0 0 10px;
}

.modal-content p {
  margin: 0 0 20px;
}

.modal-content button {
  margin: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

.modal-content button:first-of-type {
  background-color: #c38383;
  color: white;
}

.modal-content button:first-of-type:hover {
  background-color: #c82333;
}

.modal-content button:last-of-type {
  background-color: #6c757d;
  color: white;
}

.modal-content button:last-of-type:hover {
  background-color: #5a6268;
}
</style>

