const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    CourseName: {
        type: String,
        trim: true
    },
    CourseList: [String]
})

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;