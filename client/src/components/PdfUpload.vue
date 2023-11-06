<template>
    <div>
        <file-pond name="test" ref="pond" label-idle="Browse or drop files here..." :allowDrop="true"
            :itemInsertInterval="itemInsertInterval" :checkValidity="true" :allow-multiple="false" :server="server"
            accepted-file-types="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            :instant-upload="false" iconRetry="false" maxFileSize="5MB" :labelFileProcessingError="uploadError"
            fileValidateTypeLabelExpectedTypes="Expects .pdf/.docx files" @init="handleFilePondInit" />
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
            itemInsertInterval: 0,
            server: {
                // chunkSize: '1000000',
                process: async (fieldName, file, metadata, load, error, progress) => {
                    await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
                    const pond = this.$refs.pond;

                    const resume = pond.getFile();

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('resume', new Blob([resume.file]), resume.file.name);

                    try {
                        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${this.$store.getters['auth/user'].empId}/resume`, {
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
                        await this.$store.dispatch('employee/fetchResume', {
                            empId: this.$store.getters['auth/user'].empId,
                        });
                        load(response.data.file);
                        await this.$store.commit('setShowToast', { showToast: true, toastMessage: `Resume uploaded.` })
                    } catch (err) {
                        this.uploadError = err.message
                        error(err)
                        console.log(err);
                    }
                },
                revert: (src, load) => {
                    load();
                }
            },

        };
    },
    methods: {
        handleFilePondInit: function () {
            console.log('FilePond has initialized');
        },
    },
    components: {
        FilePond,
    },
};
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