<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="profile-container d-flex justify-content-center">
    <div class="shadow mb-5 bg-body rounded">
      <div class="card">
        <div class="card-body p-4">
          <div class="card-title mb-4">
            <h3 class="d-flex justify-content-center align-items-center">
              <span ref="editableName" :contenteditable="isEditing" @input="handleInput" @blur="handleBlur"
                @focus="placeCursorAtEnd">{{ name
                }}</span>
              <i class="bi bi-pencil ms-3" style="
                  font-size: 1.2rem;
                  color: cornflowerblue;
                  cursor: pointer;
                " @click="startEditing"></i>
            </h3>
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
                      <button type="button" class="upload btn btn-success" data-bs-dismiss="modal">
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <form @submit.prevent="handleEdit" novalidate>
                <div class="row mb-4">
                  <label for="inputname3" class="col-sm-4 col-lg-3 col-form-label">Employee ID</label>
                  <div class="col-sm-8 col-lg-9">
                    <input type="name" class="form-control" id="inputname3" :value="user.empId" disabled />
                  </div>
                </div>
                <div class="row my-4">
                  <label for="inputEmail3" class="col-sm-4 col-lg-3 col-form-label">Email</label>
                  <div class="col-sm-8 col-lg-9">
                    <input type="email" name="email" class="form-control" id="inputEmail3" v-model="email" />
                  </div>
                </div>
                <div class="row my-4">
                  <label for="inputname3" class="col-sm-4 col-lg-3 col-form-label">Phone Number</label>
                  <div class="col-sm-8 col-lg-9">
                    <input type="text" name="phone" class="form-control" id="inputname3" v-model="phone" />
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-12 col-md-6 my-2">
                    <button type="submit" class="edit-details btn w-100">
                      Edit details
                    </button>
                  </div>
                  <div class="col-12 col-md-6 my-2">
                    <button type="button" class="upload btn w-100" data-bs-toggle="modal"
                      @click="handleUploadType('resume')" data-bs-target="#upload">
                      {{ resume ? 'Update' : 'Upload' }} Resume
                    </button>
                  </div>
                </div>
                <!-- <div class="mt-2" v-if="resume">
                  <button type="button" class="download btn btn-dark w-100" @click="downloadPdf"
                    style="padding: 10px 30px">
                    Download Resume
                  </button>
                </div> -->
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
import { Validator } from '../../utils/Validator';

export default {
  data() {
    return {
      user: null,
      name: null,
      empId: null,
      email: null,
      phone: null,
      uploadType: null,
      profilePicture: null,
      resume: null,
      isLoading: true,
      isError: false,
      error: null,
      isEditing: false,
      originalName: '',
      formIsValid: false,
    };
  },
  async mounted() {
    this.user = await this.$store.getters['auth/user'];
    console.log(this.user);
    if (this.user) {
      this.isLoading = false;
    }

    this.name = this.user.name;
    this.email = this.user.email;
    this.phone = this.user.phone;

    const profile = await this.$store.dispatch('employee/fetchProfilePicture', {
      empId: this.user.empId,
    });

    const resume = await this.$store.dispatch('employee/fetchResume', {
      empId: this.user.empId,
    });

    if (profile) {
      this.isError = true;
      this.error = profile;
    } else if (resume) {
      this.isError = true;
      this.error = resume;
    } else {
      this.error = null;
      this.isError = false;
    }
    // this.profilePicture = await this.$store.getters['employee/profilePicture']
  },
  computed: {
    computeResume() {
      return this.$store.getters['employee/resume'];
    },
    computeProfilePicture() {
      return this.$store.getters['employee/profilePicture'];
    },
  },
  watch: {
    computeResume: {
      handler(val) {
        this.resume = val;
      },
      deep: true
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
      link.href = this.resume.url;
      // const fileExtension = this.resume.url.type;
      link.download = this.resume.name;
      link.click();
    },
    startEditing() {
      this.isEditing = true;
      this.originalName = this.user.name;

      this.$nextTick(() => {
        this.$refs.editableName.focus();
      });
    },
    placeCursorAtEnd(event) {
      // This function places the cursor at the end of the content
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(event.target);
      range.collapse(false); // Collapse the range to the end
      sel.removeAllRanges();
      sel.addRange(range);
    },
    handleInput(event) {
      // Update the user's name as it's being edited
      this.name = event.target.textContent;
    },
    async handleBlur() {
      // Finish editing when the element loses focus
      this.isEditing = false;

      if (this.name !== this.user.name || this.name !== '') {

        const res = await this.$store.dispatch('employee/editDetails', {
          newData: { name: this.name },
        });

        if (res) {
          this.isError = true;
          this.error = res;
          // console.log(this.error, this.isError, res);
        } else {
          this.error = null;
          this.isError = false;
        }
      }
    },
    handleValidations(event) {
      console.log(event.target.name, event.target.value);
      const error = Validator(event.target.name, event.target.value);
      console.log(error);
      // this.errors[event.target.name] = error[event.target.name];
    },
    async handleEdit() {
      console.log(this.user);
      const newData = {};
      let error = null;
      console.log(this.email !== this.user.email, this.email, this.user.email);
      if (this.email !== this.user.email) {
        error = Validator('email', this.email);
        console.log(error);
        if (!error.email) {
          newData['email'] = this.email;
          this.error = null;
          this.isError = false;
        } else {
          this.isError = true;
          this.error = { message: error.email, status: 400 };
        }
      }
      if (this.phone !== this.user.phone) {
        error = Validator('phone', this.phone);
        console.log(error);
        if (!error.phone) {
          newData['phone'] = this.phone;
          this.error = null;
          this.isError = false;

        } else {
          this.isError = true;
          this.error = { message: error.phone, status: 400 };
          console.log("phone error");
        }
      }

      if (!error.phone || !error.email) {
        if (Object.keys(newData).length > 0) {
          const res = await this.$store.dispatch('employee/editDetails', {
            newData,
          });

          if (res) {
            this.isError = true;
            this.error = res;
            // console.log(this.error, this.isError, res);
          } else {
            this.error = null;
            this.isError = false;
          }
        }

        // this.fetchData();
      }
      // try {
      //   if (Object.keys(newData).length > 0)
      //     this.$store.dispatch('admin/editItem', {
      //       id,
      //       newData,
      //     });

      //   this.error = null;
      //   this.isError = false;
      // } catch (err) {
      //   this.error = err;
      //   this.isError = true;
      // }
      // this.fetchData();
    },
  },
  components: {
    ImageUpload,
    PdfUpload,
    ErrorToast,
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

input {
  font-family: 'Roboto', sans-serif;
}

/* span {
  left: 0;
  text-align: center;
  font-size: 1.6rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  bottom: 0;
} */

.edit-details.btn,
.upload {
  font-size: 14px;
  text-transform: uppercase;
  background-color: #006363;
  border-color: #006363;
  padding: 10px 30px;
  /* border-radius: 40px; */
  color: #fff;
  font-weight: 700;
  box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.edit-details.btn:active,

.upload:active,
.edit-details.btn:hover,

.upload:hover {
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}

/* 
.download.btn:hover,
.download.btn:active {
  border-color: #000;
  background-color: #fff;
  color: #000;
  transition: background-color 0.5s;
} */

h3 span:focus {
  outline: #006363;
  border: 1.8px solid #000 !important;
  padding: 5px !important;
}
</style>
