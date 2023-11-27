<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="min-height: 80vh"
  >
    <!-- <div class="error-icon me-3">:(</div> -->
    <div class="error-body d-flex flex-column align-items-center">
      <div class="status">404</div>
      <div class="title mb-3">PAGE NOT FOUND</div>
      <div class="paragraph mb-3">
        The page you are looking for does not seem to exist.
      </div>
      <router-link to="/"
        ><button class="go-back btn">Go Back</button></router-link
      >
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Passion+One&family=Raleway:wght@400;500;700&display=swap');

.error-icon {
  font-family: 'Passion One', sans-serif;
  font-size: 100px;
  color: #006363 !important;
}

.error-body {
  max-width: 610px;
  width: 100%;
  /* padding-left: 190px; */
  /* line-height: 2.4; */
}

.go-back {
  font-size: 14px;
  text-transform: uppercase;
  background: #006363;
  padding: 15px 30px;
  border-radius: 40px;
  color: #fff;
  font-weight: 700;
  box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.go-back:active,
.go-back:hover {
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}

.status {
  font-family: 'Lilita One', sans-serif;
  color: #292929;
  font-size: 7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2.5px;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
}

.paragraph {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555555;
}
</style>
7
