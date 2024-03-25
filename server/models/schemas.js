const mongoose = require('mongoose');


const ProjectSchema = new mongoose.Schema({
    //name: String,
    //content: String,
    chat: String,

});


const UserSchema = new mongoose.Schema({
    //firebaseUid: String, can i use this for unique id
    username: String,
    email: String,
    projects: [ProjectSchema],

});

const Project = mongoose.model('Project', ProjectSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Project, User };