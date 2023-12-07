const Employee = require("../../models/employee");

const fetchEmployeeDetails = async (data) => {
    try {
        return await Employee.findOne(data.query).select(data.select);
    } catch (error) {
        throw error;
    }
};

const editEmployeeDetails = async (data) => {
    try {
        return await Employee.findByIdAndUpdate(
            data.id,
            { ...data.body },
            { new: true }
        ).select("empId name phone email role");
    } catch (error) {
        throw error;
    }
};

const uploadFile = async (data) => {
    const { field, empId, file, fileType } = data;

    try {
        return await Employee.findOneAndUpdate(
            { empId },

            {
                [field]: {
                    buffer: file,

                    extension: fileType.ext,

                    mimeType: fileType.mime,
                },
            },

            { new: true, passRawResult: true }
        );
    } catch (error) {
        throw error;
    }
};

// const deleteEmployee = async (data, callback) => {
// }

module.exports = {
    editEmployeeDetails,
    uploadFile,
    fetchEmployeeDetails,
};
