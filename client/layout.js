Template.layout.helpers({
    'pageCopyright': function () {
        return '© ' + moment(this.createDate).format('YYYY') + ' Manuel Wieser';
    }
});
