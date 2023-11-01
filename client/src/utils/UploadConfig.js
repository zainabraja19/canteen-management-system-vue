export function Options(type, pond) {
    const imageTypes = ["image/jpeg", "image/png", "image/jpg"]
    const docTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const options = {
        acceptedFileTypes: type === 'image' ? imageTypes : docTypes,
        maxFileSize: type === 'image' ? '2MB' : '5MB',
        server: {
            process: async (fieldName, file, metadata, load, error, progress) => {
                // const pond = this.$refs.pond;

                const uploadedFile = pond.getFile();

                // Prepare form data
                const formData = new FormData();
                formData.append(type, new Blob([uploadedFile.file]), uploadedFile.file.name);

                // for (const pair of formData.entries()) {
                //     console.log(pair[0] + ', ' + pair[1]);
                // }
                await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/A624/${type}`, {
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
                        console.log(data);
                        if (!data.data && data.error) {
                            throw data.error
                        }
                        // const base64Image = Buffer.from(
                        //     data.data.user.profilePicture
                        // ).toString('base64');
                        // this.imageUrl = `data:image/png;base64,${base64Image}`;
                        // this.$store.commit('employee/setUserProfilePicture', {
                        //     profilePicture: base64Image
                        // })
                        load(data.file);
                    })
                    .catch((err) => {
                        // this.uploadError = err
                        error(err)
                        console.log(err);
                    });
            },
        },
    }
    console.log(options);
    return options
}