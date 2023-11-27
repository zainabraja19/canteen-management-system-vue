<template>
    <div class="filepond-container">
        <file-pond name="test" ref="pond" label-idle="Browse or drop files here..." :allow-multiple="false"
            :allowDrop="true" :checkValidity="true" :server="server" class-name="my-pond" :instant-upload="false"
            :itemInsertInterval="itemInsertInterval" accepted-file-types="image/jpeg, image/jpg,image/png" maxFileSize="2MB"
            :labelFileProcessingError="uploadError" @init="handleFilePondInit" @addfilestart="handleWarning" />
    </div>
</template>

<script>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Create component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize
);


// const options = Options(this.uploadType)
// console.log(options);
// // FilePond.setOptions(options);
// setOptions(options)

export default {
    // props: ['uploadType'],
    data() {
        return {
            imageUrl: '',
            uploadError: '',
            itemInsertInterval: 0,
            server: {
                // chunkSize: '1000000',
                process: async (fieldName, file, metadata, load, error, progress) => {
                    await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
                    const pond = this.$refs.pond;

                    const image = pond.getFile();

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('profilePicture', new Blob([image.file]), image.file.name);

                    const empId = await this.$store.getters['auth/user'].empId
                    try {
                        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${empId}/profilePicture`, {
                            method: 'POST',
                            credentials: 'include',
                            body: formData,
                            onUploadProgress: (e) => {
                                progress(e.lengthComputable, e.loaded, e.total);
                            },

                        })

                        const response = await res.json()

                        if (!response.data && response.error) {
                            throw { message: response.error, status: response.status }
                        }
                        await this.$store.dispatch('employee/fetchProfilePicture', {
                            empId,
                        });
                        load(response.data.file);
                        // this.$refs.pond.destroy()
                        await this.$store.commit('setShowToast', { showToast: true, toastMessage: `Profile picture uploaded.` })
                    } catch (err) {
                        this.uploadError = err.message
                        error(err)
                        console.log(err);
                    }
                },
                revert: (src, load) => {
                    load();
                },

            },

        };
    },
    methods: {
        handleFilePondInit() {
            console.log('FilePond has initialized');
        },
        handleWarning() {
            console.log("warning");
        },
        handleError() {
            console.log("error");
        }
    },
    components: {
        FilePond,
    }
}
</script>

<style>
.filepond--root,
.filepond--root .filepond--drop-label {
    height: 200px;
}

.filepond--panel-root,
.filepond--data {
    height: 200px;
}


/* 
.filepond--panel-root {
    background-color: transparent;
    border: 2px solid #2c3340;
} */
</style>