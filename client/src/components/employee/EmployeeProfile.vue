<template>
    <div>

        <div class="row justify-content-around">
            <!-- <div class="col-12 d-flex justify-content-center align-items-center"> -->
            <div class="col-md-4 d-flex flex-column align-items-center">
                <img :src="profilePicture" class="profilePicture img-fluid" alt="image-boiler" />

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
                                <button type="button" class="btn btn-success" data-bs-dismiss="modal">Save</button>
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
                                        Upload Resume</button>
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
import ImageUpload from '../../components/fileupload/ImageUpload.vue';
import PdfUpload from '../../components/fileupload/PdfUpload.vue';
// import { pdf } from 'vue-pdf';
// import VuePdfEmbed from 'vue-pdf-embed'
// import PSPDFKit from 'pspdfkit';

export default {
    data() {
        return {
            user: this.$store.getters['auth/user'],
            profileUrl: null,
            uploadType: null,
            // pdfBuffer: null,
            pdfDataURL: null,
            // profilePicture: null,
            // resume: null
        };
    },
    created() {
        // this.profilePicture = this.$store.getters['employee/profilePicture']
        // this.resume = this.$store.getters['employee/resume']
        // console.log(this.profilePicture, this.resume);
        this.$store.dispatch('employee/fetchProfilePicture', {
            empId: this.user.empId,
        }, { root: true });

        this.$store.dispatch('employee/fetchResume', {
            empId: this.user.empId,
        }, { root: true });
    },
    computed: {
        // profile() {
        //     if (this.user.profilePicture) {
        //         return `data:image/png;base64,${this.$store.getters['employee/profilePicture']}`;
        //     } else {
        //         return this.$store.getters['employee/profilePicture']
        //     }
        // },
        resume() {
            console.log("computed");
            return this.$store.getters['employee/resume']
        },
        profilePicture() {
            var b = Buffer.from(this.$store.getters['employee/profilePicture']);
            const blob = new Blob([b], { type: 'image/png' });
            const url = window.URL.createObjectURL(blob)
            return url
        }
    },
    watch: {

    },
    methods: {
        handleUploadType(type) {
            this.uploadType = type
        },
        async downloadPdf() {
            var b = Buffer.from(this.resume, 'base64');

            // Create a Blob from the buffer
            const blob = new Blob([b], { type: 'application/pdf' });

            // Create a download link and trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'output.pdf';
            link.click();
        },
    },
    components: {
        ImageUpload,
        PdfUpload,
    },
};
</script>
  
<style scoped>
.profilePicture {
    width: 100%;
    height: 100%;
    max-width: 12rem;
    max-height: 12rem;
    border-radius: 50%;
    /* object-fit: inherit */
}
</style>