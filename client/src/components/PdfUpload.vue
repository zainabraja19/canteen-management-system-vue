<template>
    <div>
        <file-pond name="test" ref="pond" label-idle="Browse or drop files here..." :allowDrop="true"
            :itemInsertInterval="1" :allow-multiple="false" :server="server" acceptedFileTypes="application/pdf"
            maxFileSize="5MB" :labelFileProcessingError="uploadError" />
    </div>
</template>

<script>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';


// Create component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
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
            server: {
                // chunkSize: '1000000',
                process: async (fieldName, file, metadata, load, error, progress) => {
                    const pond = this.$refs.pond;

                    const image = pond.getFile();

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('resume', new Blob([image.file]), image.file.name);

                    await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${this.$store.getters['auth/user'].empId}/resume`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                        onUploadProgress: (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        },

                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            await this.$store.dispatch('employee/fetchResume', {
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
    components: {
        FilePond,
    },
    methods: {
        removeFile() {
            const buttonElement = document.querySelector('button[type="button"]');
            buttonElement.addEventListener("click", () => {
                this.$refs.pond.removeFiles();
            });
        }
    },
};
</script>
