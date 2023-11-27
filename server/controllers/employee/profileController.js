const profileService = require("../../services/employee/profileService");
const FileType = require("file-type");

const fetchEmployeeDetails = async (req, res) => {
    try {
        const emp = await Employee.findById(req.user._id);
        res.status(200).json({ data: emp, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const editEmployeeDetails = async (req, res) => {
    try {
        const data = { id: req.user._id, body: req.body };
        const result = await profileService.editEmployeeDetails(data);

        Object.keys(data.body).map((field) => {
            req.user[field] = data.body[field];
        });

        res.status(200).json({ data: result, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const fetchFile = async (req, res) => {
    try {
        const data = { query: { empId: req.params.empId }, select: req.select };
        const result = await profileService.fetchEmployeeDetails(data);

        if (result.profilePicture) {
            res.status(200).json({ data: result, status: 200 });
        } else {
            res.status(200).json({ data: "", status: 200 });
        }
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const uploadFile = async (req, res) => {
    try {
        const fileType = await FileType.fromBuffer(req.file.buffer);
        const data = {
            field: req.field,
            empId: req.params.empId,
            file: req.file.buffer,
            fileType,
        };

        const result = await profileService.uploadFile(data);
        res.status(201).json({
            status: 201,
            data: {
                id: data.empId,
                name: data.file.originalname,
                size: data.file.size,
            },
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
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
//     profileService.deleteEmployee(data, (error, result) => { })
// }

module.exports = {
    fetchEmployeeDetails,
    editEmployeeDetails,
    // deleteEmployee,
    // fetchProfilePicture,
    // // uploadProfilePicture,
    // fetchResume,
    // uploadResume,
    uploadFile,
    fetchFile,
};
