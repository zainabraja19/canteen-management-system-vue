const Employee = require("../../../database/models/employee");
const profileRepository = require("../../../database/repository/employee/profileRepository");
const FileType = require("file-type");

const fetchEmployeeDetails = async (data) => {
    const query = { ...data };
    const select = "_id, empId, name,email, phone";

    return await profileRepository.fetchEmployeeDetails({ query, select });
};

const editEmployeeDetails = async (data) => {
    return await profileRepository.editEmployeeDetails(data);
};

const fetchFile = async (data) => {
    return await profileRepository.fetchEmployeeDetails(data);
};

const uploadFile = async (data) => {
    const fileType = await FileType.fromBuffer(data.file);

    return await profileRepository.uploadFile({ ...data, fileType });
};

// const deleteEmployee = (req, res) => {
//         try {
//             const emp = await Employee.findByIdAndDelete(req.user._id);

//             if (!emp) {
//                 return res.status(404).json({ error: 'Employee not found' });
//             }

//             await Cart.deleteMany({ employee: req.user._id });
//             await Order.deleteMany({ orderedBy: req.user._id });

//             res.status(200).json({ data: "Deleted successfully", status: 200 })

//         } catch (error) {
//             console.log(error)
//             res.status(400).json({ data: null, error: error.message, status: 400 })
//         }
//     profileRepository.deleteEmployee(data, (error, result) => { })
// }

module.exports = {
    fetchEmployeeDetails,
    editEmployeeDetails,
    uploadFile,
    fetchFile,
};
