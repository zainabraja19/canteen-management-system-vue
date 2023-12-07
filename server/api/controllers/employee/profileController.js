const Employee = require("../../../database/models/employee");
const profileService = require("../../services/employee/profileService");
const FileType = require("file-type");

const fetchEmployeeDetails = async (req, res) => {
    try {
        const data = await profileService.fetchEmployeeDetails({
            _id: req.user._id,
        });

        res.status(200).json({ data, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const editEmployeeDetails = async (req, res) => {
    try {
        const data = await profileService.editEmployeeDetails({
            id: req.user._id,
            body: req.body,
        });

        Object.keys(req.body).map((field) => {
            req.user[field] = req.body[field];
        });

        res.status(200).json({ data, status: 200 });
    } catch (error) {
        const err = Employee.handleError(error);

        res.status(400).json({ data: null, error: err, status: 400 });
    }
};

const fetchFile = async (req, res) => {
    try {
        const data = await profileService.fetchFile({
            query: { empId: req.params.empId },
            select: req.select,
        });

        if (!data.profilePicture) {
            return res.status(200).json({ data: "", status: 200 });
        }

        res.status(200).json({ data, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

const uploadFile = async (req, res) => {
    try {
        const data = await profileService.uploadFile({
            field: req.field,
            empId: req.params.empId,
            file: req.file.buffer,
        });

        res.status(201).json({
            status: 201,
            data: {
                id: req.params.empId,
                name: req.file.buffer.originalname,
                size: req.file.buffer.size,
            },
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 });
    }
};

module.exports = {
    fetchEmployeeDetails,
    editEmployeeDetails,
    uploadFile,
    fetchFile,
};
