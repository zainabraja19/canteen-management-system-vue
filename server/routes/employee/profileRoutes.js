const express = require('express')
const router = express.Router({ mergeParams: true })
const { profilePictureUpload, resumeUpload } = require('../../utils/fileUploadConfig')
const { validateRequest } = require('../../middleware/schemaValidator')
const { editEmployeeDetailsSchema } = require('../../schema/employeeSchema')

const profileController = require('../../controllers/employee/profileController')

router.get('', profileController.fetchEmployeeDetails)
router.patch('', validateRequest(editEmployeeDetailsSchema), profileController.editEmployeeDetails)
// router.delete('', profileController.deleteEmployee)
router.get('/profilePicture', (req, res, next) => {
    req.select = 'profilePicture'
    next()
}, profileController.fetchFile)

router.post('/profilePicture', profilePictureUpload.single('profilePicture'), (req, res, next) => {
    req.field = 'profilePicture'
    next()
}, profileController.uploadFile)

router.get('/resume', (req, res, next) => {
    req.select = 'resume'
    next()
}, profileController.fetchFile)

router.post('/resume', resumeUpload.single('resume'), (req, res, next) => {
    req.field = 'resume'
    next()
}, profileController.uploadFile)

module.exports = router