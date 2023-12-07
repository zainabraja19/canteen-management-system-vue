const Employee = require("../../../database/models/employee");

// const findemployee = async (data, callback) => {
//     try {
//         const emp = await Employee.findOne(data).select(data.select)

//         callback(null, emp)
//     } catch (error) {
//         callback(error)
//     }
// }

const fetchEmployeeDetails = async (data, callback) => {
    try {
        const emp = await Employee.findOne(data.query).select(data.select);
        return emp;
    } catch (error) {
        throw error;
    }
};

const editEmployeeDetails = async (data, callback) => {
    try {
        const emp = await Employee.findByIdAndUpdate(
            data.id,
            { ...data.body },
            { new: true }
        ).select("empId name phone email role");

        return emp;
    } catch (error) {
        throw error;
    }
};

// const deleteEmployee = async (data, callback) => {
// }

const uploadFile = async (data, callback) => {
    const { field, empId, file, fileType } = data;
    try {
        await Employee.findOneAndUpdate(
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

        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    editEmployeeDetails,
    uploadFile,
    fetchEmployeeDetails,
};
