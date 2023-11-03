<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="profile-container d-flex justify-content-center">
    <div class="shadow mb-5 bg-body rounded">
      <div class="card">
        <div class="card-body p-4">
          <div class="card-title text-center mb-4">
            <h3>{{ user.name }}</h3>
            <hr />
          </div>

          <div class="row g-4 justify-content-around">
            <div class="col-md-4 d-flex flex-column align-items-center">
              <!-- <img :src="profilePicture" class="profilePicturee img-fluid" alt="image-boiler" /> -->
              <div :style="{
                background: 'url(' + profilePicture + ')',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }" class="profilePicture d-flex justify-content-end align-items-end">
                <span class="camera-icon" type="button" data-bs-toggle="modal" @click="handleUploadType('image')"
                  data-bs-target="#upload"><i class="bi bi-camera-fill"></i></span>
              </div>

              <!-- Modal -->
              <div class="modal fade" id="upload" tabindex="-1" aria-labelledby="uploadLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="uploadLabel">
                        Upload {{ uploadType }}
                      </h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <ImageUpload v-if="uploadType === 'image'" />
                      <PdfUpload v-else />
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8">

              <form>
                <div class="row mb-4">
                  <label for="inputname3" class="col-sm-4 col-lg-3 col-form-label">Employee ID</label>
                  <div class="col-sm-8 col-lg-9">
                    <input type="name" class="form-control" id="inputname3" :value="user.empId" disabled />
                  </div>
                </div>
                <div class="row my-4">
                  <label for="inputEmail3" class="col-sm-4 col-lg-3 col-form-label">Email</label>
                  <div class="col-sm-8 col-lg-9">
                    <input type="email" class="form-control" id="inputEmail3" :value="user.email" />
                  </div>
                </div>
                <div class="row my-4">
                  <label for="inputname3" class="col-sm-4 col-lg-3 col-form-label">Phone Number</label>
                  <div class="col-sm-8 col-lg-9">
                    <input type="name" class="form-control" id="inputname3" :value="user.phone" />
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-12 col-md-6 my-2">
                    <button type="submit" class="btn btn-primary w-100" disabled>
                      Edit details
                    </button>
                  </div>
                  <div class="col-12 col-md-6 my-2">
                    <button type="button" class="btn btn-success w-100" data-bs-toggle="modal"
                      @click="handleUploadType('resume')" data-bs-target="#upload">
                      {{ resume ? 'Update' : 'Upload' }} Resume
                    </button>
                  </div>
                </div>
                <div class="mt-2" v-if="resume">
                  <button type="button" class="btn btn-dark w-100" @click="downloadPdf">
                    Download Resume
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <!-- <Upload /> -->
  </div>
</template>

<script>
import ImageUpload from '../../components/ImageUpload.vue';
import PdfUpload from '../../components/PdfUpload.vue';
import ErrorToast from '../../components/ErrorToast.vue';

export default {
  data() {
    return {
      user: null,
      uploadType: null,
      profilePicture: null,
      resume: null,
      isLoading: true,
      isError: false,
      error: null
    };
  },
  async created() {
    this.user = await this.$store.getters['auth/user']

    if (this.user) {
      this.isLoading = false
    }
    try {
      this.$store.dispatch('employee/fetchProfilePicture', {
        empId: this.user.empId,
      });

      this.$store.dispatch('employee/fetchResume', {
        empId: this.user.empId,
      });
      this.error = null
      this.isError = false
    } catch (err) {
      this.error = err
      this.isError = true
    }
    // this.profilePicture = await this.$store.getters['employee/profilePicture']
  },
  computed: {
    computeResume() {
      console.log('computed');
      return this.$store.getters['employee/resume'];
    },
    computeProfilePicture() {
      return this.$store.getters['employee/profilePicture'];
    },
  },
  watch: {
    computeResume(val) {
      this.resume = val;
    },
    computeProfilePicture(val) {
      this.profilePicture = val;
    },
  },
  methods: {
    handleUploadType(type) {
      this.uploadType = type;
    },
    async downloadPdf() {
      const link = document.createElement('a');
      link.href = this.resume;
      console.log(link);
      const fileExtension = this.resume.type;
      console.log(fileExtension);
      link.download = 'output';
      link.click();
    },
  },
  components: {
    ImageUpload,
    PdfUpload,
    ErrorToast
  },
  // mounted() {
  //     this.$watch('computeProfilePicture', async (val) => {
  //         console.log(val);

  //         this.profilePicture = val
  //     })
  // },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Lilita+One&family=Varela+Round&display=swap');

h3 {
  font-family: 'Lilita One';
}

.profile-container {
  min-width: 100%;
  /* max-width: 75%; */
  /* min-height: 85vh; */
}

.profile-container .shadow {
  min-width: 65%;
}

.profilePicture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center right;
  border: 4px solid #e3e3e3;
}

.camera-icon {
  background-color: rgb(193, 193, 193);
  border: 3px solid #e3e3e3;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* span {
  left: 0;
  text-align: center;
  font-size: 1.6rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  bottom: 0;
} */
</style>
