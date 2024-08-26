<template>
  <div id="app" class="landing-page">
    <section class="hero">
      <div class="hero-content">
        <h1>ThoughtCraft</h1>
        <p>Where Creativity Meets Insight</p>
        <button @click="exploreContent">Explore the Blog</button>
      </div>
    </section>

    <section class="introduction">
      <h2>Welcome to ThoughtCraft</h2>
      <p>
        A space where ideas come to life through words. Whether you’re looking for inspiration, practical advice, or a fresh perspective, you’ll find content here that sparks curiosity and fuels creativity.
      </p>
    </section>

    <section class="categories">
      <h2>Explore Our Topics</h2>
      <div class="category-cards">
        <div class="category-card">
          <h3>Mindful Living</h3>
          <p>Tips and insights on living with intention and purpose.</p>
        </div>
        <div class="category-card">
          <h3>Creative Pursuits</h3>
          <p>Articles on art, writing, and the creative process.</p>
        </div>
        <div class="category-card">
          <h3>Tech and Tools</h3>
          <p>Reviews and insights on tools that boost productivity.</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Ready to Dive In?</h2>
      <button @click="exploreContent">Explore the Blog</button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    exploreContent() {
      this.$router.push('/posts');
    }
  }
};
</script>

<style scoped>

.landing-page {
  font-family: 'Ubuntu', sans-serif;
  text-align: center;
  color: #333;
}

.hero {
  background: url('..\assets\Background111.jpg') no-repeat center center;
  background-size: cover;
  padding: 80px 20px;
  color: #c38383;
}

.hero-content h1 {
  font-size: 3em;
  margin-bottom: 10px;
}

.hero-content p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.hero-content button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #fff;
  color: #15737b;
  border: none;
  cursor: pointer;
}

.introduction {
  padding: 60px 20px;
}

.introduction h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.categories {
  background-color: #f5f5f5;
  padding: 60px 20px;
  margin-bottom: 30px; 
}

.category-cards {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.category-card {
  background: #c1d7d9;
  padding: 20px;
  margin: 10px;
  width: 30%;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.category-card h3 {
  margin-bottom: 10px;
}

.cta {
  padding: 60px 20px;
  background-color: #ce8686;
  color: white;
}

.cta h2 {
  font-size: 2em;
  margin-bottom: 20px;
}

.cta button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: white;
  color: #185e64;
  border: none;
  cursor: pointer;
}
</style>
