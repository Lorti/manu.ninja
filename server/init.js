Meteor.startup(function () {
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/',
        uploadDir: process.env.PWD + '/public/uploads',
        checkCreateDirectories: true
    })
});
