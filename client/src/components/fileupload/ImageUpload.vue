<template>
    <div>
        <file-pond name="test" ref="pond" label-idle="Browse or drop files here..." :allow-multiple="false" :server="server"
            acceptedFileTypes="image/jpeg,image/png,image/jpg" maxFileSize="2MB" :labelFileProcessingError="uploadError" />
    </div>
</template>

<script>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';


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
            server: {
                // chunkSize: '1000000',
                process: async (fieldName, file, metadata, load, error, progress) => {
                    const pond = this.$refs.pond;

                    const image = pond.getFile();

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('profilePicture', new Blob([image.file]), image.file.name);

                    await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${this.$store.getters['auth/user'].empId}/profilePicture`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                        onUploadProgress: (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        },

                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            // passing the file id to FilePond
                            //   console.log(data);
                            //   const blob = new Blob([data.data.user.profilePicture.data], {
                            //     type: data.data.contentType,
                            //   });
                            //   console.log(blob);
                            //   const imageUrl = URL.createObjectURL(blob);
                            //   this.imageUrl = imageUrl;
                            //   const buffer = await data.data.user.profilePicture.arrayBuffer();
                            // if (!data.data && data.error) {
                            //     throw data.error
                            // }
                            // const base64Image = Buffer.from(
                            //     data.data.user.profilePicture
                            // ).toString('base64');
                            // this.imageUrl = `data:image/png;base64,${base64Image}`;
                            // this.$store.commit('employee/setUserProfilePicture', {
                            //     profilePicture: base64Image
                            // })
                            // // this.imageUrl = data.data.user.profilePicture
                            // // console.log(this.imageUrl);
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
};
</script>
