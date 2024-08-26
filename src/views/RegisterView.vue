<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { type Register } from '../api/ToDoListApi';


const email = ref('');
const password = ref('');
const name = ref('');
const confirmedPassword = ref('');

const errorMessage = ref('');

const apiUrl =import.meta.env.VITE_API_URL;

const router = useRouter();

// Register function
const register = async () => {
  try {
    const response = await axios.post(`${apiUrl}/register`, {
      email: email.value,
      name: name.value,
      password: password.value,
      password_confirmation: confirmedPassword.value
    });

    const { token } = response.data;

    localStorage.setItem('authToken', token);

    router.push('/login');
  } catch (error) {
  if (error.response && error.response.data) {
    console.error('Registration error:', error.response.data);
    errorMessage.value = `Registration failed: ${error.response.data.message || 'Please try again.'}`;
  } else {
    errorMessage.value = 'Registration failed. Please try again.';
  }
}

};
</script>
<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
       <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmpassword">Confirm Password:</label>
        <input type="password" id="confirmedPassword" v-model="confirmedPassword" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>
      Already have an account? <RouterLink to="/login">Go to Login</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.register {
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
  font-family: 'Roboto', sans-serif; 
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
  font-family: 'Roboto', sans-serif; /* Match existing font */
}
</style>