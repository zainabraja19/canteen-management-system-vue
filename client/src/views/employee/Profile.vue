<template>
    <div>

        <div class="row justify-content-around">
            <!-- <div class="col-12 d-flex justify-content-center align-items-center"> -->
            <div class="col-md-4 d-flex flex-column align-items-center">
                <!-- <img :src="profilePicture" class="profilePicturee img-fluid" alt="image-boiler" /> -->

                <div :style="{ background: 'url(' + profilePicture + ')', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: '150px', width: '150px', borderRadius: '50%' }"
                    class="profilePicture">
                </div>

                <!-- Button trigger modal -->
                <button type="button" class="btn btn-secondary mt-4" data-bs-toggle="modal"
                    @click="handleUploadType('image')" data-bs-target="#upload">
                    Upload </button>

                <!-- Modal -->
                <div class="modal fade" id="upload" tabindex="-1" aria-labelledby="uploadLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="uploadLabel">Upload {{ uploadType }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <ImageUpload v-if="uploadType === 'image'" />
                                <PdfUpload v-else />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success" data-bs-dismiss="modal">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">{{ user.name }}</h3>
                        <form>
                            <div class="row mb-3">
                                <label for="inputname3" class="col-sm-4 col-lg-3 col-form-label">Employee ID</label>
                                <div class="col-sm-8 col-lg-9">
                                    <input type="name" class="form-control" id="inputname3" :value="user.empId" disabled />
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="inputEmail3" class="col-sm-4 col-lg-3 col-form-label">Email</label>
                                <div class="col-sm-8 col-lg-9">
                                    <input type="email" class="form-control" id="inputEmail3" :value="user.email" />
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="inputname3" class="col-sm-4 col-lg-3 col-form-label">Phone Number</label>
                                <div class="col-sm-8 col-lg-9">
                                    <input type="name" class="form-control" id="inputname3" :value="user.phone" />
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col">
                                    <button type="submit" class="btn btn-primary w-100" disabled>
                                        Edit details
                                    </button>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-success w-100" data-bs-toggle="modal"
                                        @click="handleUploadType('resume')" data-bs-target="#upload">
                                        {{ resume ? "Update" : "Upload" }} Resume</button>
                                </div>
                            </div>
                            <div class="mt-4" v-if="resume">
                                <button type="button" class="btn btn-dark w-100" @click="downloadPdf">Download PDF</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- <Upload /> -->

    </div>
</template>
  
<script>
import ImageUpload from '../../components/ImageUpload.vue';
import PdfUpload from '../../components/PdfUpload.vue';

export default {
    data() {
        return {
            user: this.$store.getters['auth/user'],
            uploadType: null,
            profilePicture: null,
            resume: null
        };
    },
    async created() {
        this.$store.dispatch('employee/fetchProfilePicture', {
            empId: this.user.empId,
        });

        this.$store.dispatch('employee/fetchResume', {
            empId: this.user.empId,
        });

        // this.profilePicture = await this.$store.getters['employee/profilePicture']
    },
    computed: {
        computeResume() {
            console.log("computed");
            return this.$store.getters['employee/resume']
        },
        computeProfilePicture() {
            return this.$store.getters['employee/profilePicture']
        }
    },
    watch: {
        computeResume(val) {
            this.resume = val
        },
        computeProfilePicture(val) {
            this.profilePicture = val
        }
    },
    methods: {
        handleUploadType(type) {
            this.uploadType = type
        },
        async downloadPdf() {
            const link = document.createElement('a');
            link.href = this.resume;
            link.download = 'output.pdf';
            link.click();
        },
    },
    components: {
        ImageUpload,
        PdfUpload,
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
.profilePicturee {
    width: 150px;
    height: 150px;
    border-radius: 50%;

    object-fit: cover;
    object-position: center right;
}
</style>