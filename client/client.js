Meteor.subscribe('theArticles');

Template.registerHelper('pageTitle', function () {
    return Meteor.settings.public.seo.title;
});

Template.registerHelper('pageCopyright', function () {
    return '© ' + moment(this.createDate).format('YYYY') + ' Manuel Wieser';
});

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
Template.articles.helpers({
    'entry': function () {
        return Articles.find({}, {sort: {createDate: -1}});
    }
});
Template.editor.helpers({
    preview: function () {
        return Session.get('preview');
    }
});
Template.editor.events({
    'input textarea': function (event) {
        Session.set('preview', event.target.value);
    },
    'submit form': function (event) {
        event.preventDefault();
        var data = {
            _id: event.target._id.value,
            title: event.target.title.value,
            category: event.target.category.value,
            content: event.target.content.value
        };
        console.log(data._id);
        if (data._id) {
            Meteor.call('updateArticle', data);
        } else {
            Meteor.call('insertArticle', data);
            Router.go('/article/' + slugify(data.title));
        }
    }
});
