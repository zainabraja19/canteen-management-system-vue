<template>
    <div class="filepond-container">
        <file-pond name="test" ref="pond" label-idle="Browse or drop files here..." :allow-multiple="false"
            :allowDrop="true" :checkValidity="true" :server="server" class-name="my-pond" :instant-upload="false"
            :itemInsertInterval="itemInsertInterval" accepted-file-types="image/jpeg, image/png" maxFileSize="2MB"
            :labelFileProcessingError="uploadError" @init="handleFilePondInit" />
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
                    const pond = this.$refs.pond;

                    const image = pond.getFile();

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('profilePicture', new Blob([image.file]), image.file.name);

                    await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${this.$store.getters['auth/user'].empId}/profilePicture`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                        onUploadProgress: (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        },

                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            await this.$store.dispatch('employee/fetchProfilePicture', {
                                empId: this.$store.getters['auth/user'].empId,
                            });
                            load(data.file);
                        })
                        .catch((err) => {
                            this.uploadError = err
                            error(err)
                            console.log(err);
                        });
                },
                revert: (src, load) => {
                    load();
                }
            },

        };
    },
    // watch: {
    //     uploadType: {
    //         handler(val) {
    //             this.pondOptions = Options(val, this.$refs.pond)
    //         },
    //         // immediate: true
    //     }
    // },
    // created() {
    //     // Set options using v-bind:options in the template
    //     setOptions(this.pondOptions);
    // },
    methods: {
        handleFilePondInit: function () {
            console.log('FilePond has initialized');
        },
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