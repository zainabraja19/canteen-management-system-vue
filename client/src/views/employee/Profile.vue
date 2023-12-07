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
              {{ user.name }}
              <!-- <span ref="editableName" :contenteditable="isEditingName" @input="handleInput" @blur="handleBlur"
                @focus="placeCursorAtEnd">{{ name
                }}</span>
              <i class="bi bi-pencil ms-3" style="
                  font-size: 1.2rem;
                  color: cornflowerblue;
                  cursor: pointer;
                " @click="startEditing"></i> -->
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
              <form class="user-details" novalidate>
                <div class="row mb-4">
                  <label for="inputname3" class="col-sm-4 col-xl-3 col-form-label">Employee ID</label>
                  <div class="col-sm-8 col-xl-9">
                    <input type="name" class="form-control" id="inputname3" :value="user.empId" disabled />
                  </div>
                </div>
                <div class="row my-4">
                  <label for="inputEmail3" class="col-sm-4 col-xl-3 col-form-label">Email</label>
                  <div class="col-sm-8 col-xl-9">
                    <input type="email" name="email" class="form-control" id="inputEmail3" :value="user.email" disabled />
                  </div>
                </div>
                <div class="row my-4">
                  <label for="inputname3" class="col-sm-4 col-xl-3 col-form-label">Phone Number</label>
                  <div class="col-sm-8 col-xl-9">
                    <input type="text" name="phone" class="form-control" id="inputname3" :value="user.phone"
                      maxlength="10" disabled />
                  </div>
                </div>
                <div class="row mt-4 d-flex justify-content-end ">
                  <div class="col-12 col-sm-8 col-md-6 col-xl-4">
                    <button type="button" data-bs-toggle="modal" data-bs-target="#editDetailsModal"
                      class="edit-details btn w-100">
                      Edit details
                    </button>
                  </div>
                  <!-- <div class="col-12 col-md-6 my-2">
                    <button type="button" class="upload btn w-100" data-bs-toggle="modal"
                      @click="handleUploadType('resume')" data-bs-target="#upload">
                      {{ resume ? 'Update' : 'Upload' }} 
                     Resume
                    </button>
                  </div> -->
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
    <div class="modal fade" ref="myModal" id="editDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Edit Details
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-2">
            <form class="px-2" @submit.prevent="handleEdit" novalidate>
              <div class="row mb-1">
                <div class="col-12">
                  <label for="inputname3" class="col-form-label ">Employee ID</label>
                  <div>
                    <input type="text" class="form-control" id="inputname3" :value="user.empId" disabled />
                  </div>
                </div>
              </div>
              <div class="row mb-1">
                <div class="col-12">
                  <label for="inputName" class="col-form-label">Name</label>
                  <div>
                    <input type="text" name="name" class="form-control" id="inputName" @change="handleValidations"
                      v-model.trim="name" />
                  </div>
                  <div class="text-danger mt-2" v-if="fieldErrors.name" style="text-transform: capitalize">
                    <i class="bi bi-info-circle"></i> {{ fieldErrors.name }}
                  </div>
                </div>
              </div>
              <div class="row mb-1">
                <div class="col-12">
                  <label for="inputEmail3" class="col-form-label">Email</label>
                  <div>
                    <input type="email" name="email" class="form-control" id="inputEmail3" @change="handleValidations"
                      v-model.trim="email" />
                  </div>
                  <div class="text-danger mt-2" v-if="fieldErrors.email" style="text-transform: capitalize">
                    <i class="bi bi-info-circle"></i> {{ fieldErrors.email }}
                  </div>
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-12">
                  <label for="inputname3" class="col-form-label">Phone Number</label>
                  <div>
                    <input type="text" name="phone" class="form-control" id="inputname3" @change="handleValidations"
                      v-model.trim="phone" maxlength="10" />
                  </div>
                  <div class="text-danger mt-2" v-if="fieldErrors.phone" style="text-transform: capitalize">
                    <i class="bi bi-info-circle"></i> {{ fieldErrors.phone }}
                  </div>
                </div>
              </div>
              <div class="modal-footer pe-0 mt-2">
                <!-- Form valid: {{ formIsValid }}
                DB Error: {{ dbError }} -->
                <button type="button" class="edit-details btn btn-outline-dark" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="edit-details btn" :disabled="!formIsValid" data-bs-dismiss="modal">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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
      isEditingName: false,
      isEditingDetails: false,
      originalName: '',
      dbError: true,
      fieldErrors: {},
      showModal: true
    };
  },
  async mounted() {
    this.user = await this.$store.getters['auth/user'];

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
    formIsValid() {
      if (this.email === '' || this.phone === '' || this.name === '') {
        return false;
      } else if (!this.fieldErrors.email && !this.fieldErrors.phone && !this.fieldErrors.name) {
        return true;
      }
      return false;
    },
    computedShowModal() {
      return this.formIsValid && !this.dbError
    }
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
    computedShowModal(val) {
      this.showModal = val
    }
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
    handleValidations(event) {
      // this.dbError = true
      const error = Validator(event.target.name, event.target.value);
      this.fieldErrors[event.target.name] = error[event.target.name];
    },
    // startEditing() {
    //   this.isEditingName = true;
    //   this.originalName = this.user.name;

    //   this.$nextTick(() => {
    //     this.$refs.editableName.focus();
    //   });
    // },
    // placeCursorAtEnd(event) {
    //   const range = document.createRange();
    //   const sel = window.getSelection();
    //   range.selectNodeContents(event.target);
    //   range.collapse(false); // Collapse the range to the end
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    // },
    // handleInput(event) {
    //   // Update the user's name as it's being edited
    //   this.name = event.target.textContent;
    // },
    // async handleBlur() {
    //   // Finish editing when the element loses focus
    //   this.isEditingName = false;

    //   if (this.name !== this.user.name || this.name !== '') {

    //     const res = await this.$store.dispatch('employee/editDetails', {
    //       newData: {
    //         name: this.name
    //       },
    //       empId: this.user.empId
    //     });

    //     if (res) {
    //       this.isError = true;
    //       this.error = res;
    //       // console.log(this.error, this.isError, res);
    //     } else {
    //       this.error = null;
    //       this.isError = false;
    //     }
    //   }
    // },
    async handleEdit() {
      // this.dbError = false
      const newData = {};

      if (this.email !== this.user.email) {
        newData['email'] = this.email;
      }

      if (this.phone !== this.user.phone) {
        newData['phone'] = this.phone;
      }

      if (this.name !== this.user.name) {
        newData['name'] = this.name
      }

      if (Object.keys(newData).length > 0) {
        const res = await this.$store.dispatch('employee/editDetails', {
          newData,
          empId: this.user.empId,
        });

        if (res) {
          this.isError = true;
          this.error = res;
          this.dbError = true
        } else {
          this.error = null;
          this.isError = false;
          this.dbError = false
          this.user = await this.$store.getters['auth/user'];
        }
      }
    },
  },
  components: {
    ImageUpload,
    PdfUpload,
    ErrorToast,
  },
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

.user-details input:disabled {
  background-color: rgb(246, 241, 241, 0.4);
}

.edit-details.btn,
.upload {
  font-size: 0.8rem;
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

h3 span:focus {
  outline: #006363;
  border: 1.8px solid #000 !important;
  padding: 5px !important;
}

@media screen and (max-width: 575px) {

  .shadow,
  .shadow .card {
    border: none;
    box-shadow: none !important;
  }
}
</style>
