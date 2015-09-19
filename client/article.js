Template.article.helpers({
    'date': function () {
        return moment(this.createDate).format('MMMM D, YYYY');
    },
    'excerpt': function () {
        if (Router.current().route.getName() === 'index') {
            return this.content.split('\n')[0].slice(0, -3) + '…';
        } else {
            return false;
        }
    }
});
Template.article.events({
    'click .create': function () {
        Router.go('/editor');
    },
    'click .edit': function () {
        Router.go('/article/' + this.slug + '/edit');
    },
    'click .remove': function () {
        var confirm = window.confirm('Do you really want to remove “' + this.title + '”?');
        if (confirm) {
            Meteor.call('removeArticle', this._id);
            Router.go('/');
        }
    }
});
