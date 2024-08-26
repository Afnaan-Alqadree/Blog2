<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>
      Don't have an account? <RouterLink to="/register">Go to Register</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';


const email = ref('');
const password = ref('');


const errorMessage = ref('');

const apiUrl =import.meta.env.VITE_API_URL;


const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post(`${apiUrl}/login`, {
      email: email.value,
      password: password.value
    });
    const { token } = response.data;

    
    localStorage.setItem('authToken', token);
    const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });  
    localStorage.setItem('userId', userResponse.data.id);
    localStorage.setItem('userName', userResponse.data.name);
    
    router.push('/'); 
  } catch (error) {
    errorMessage.value = 'Login failed.';
    console.error('Login error:', error);
  }
};
</script>

<style scoped>
.login {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 20px;
}

h1 {
  font-family: 'Roboto', sans-serif;
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
  font-family: 'Roboto', sans-serif;
  color: #333; 
}

input {
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
  font-family: 'Roboto', sans-serif; 
  margin-top: 15px;
  margin-bottom:10px;
}

button:hover {
  background-color: #555;
}

.error {
  color: red;
  margin-top: 15px;
  font-family: 'Ubuntu', sans-serif;
}

p {
  text-align: center;
  margin-top: 1rem;
}
</style>
