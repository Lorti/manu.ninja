Router.configure({
    layoutTemplate: 'layout'
});

Router.onAfterAction(function () {
    document.title = Meteor.settings.public.seo.title;
});

Router.route('/', {
    name: 'index',
    template: 'index'
});

Router.route('/login');
Router.route('/logout', function () {
    Meteor.logout(function () {
        Router.go('/');
    });
});
Router.route('/editor');

Router.route('/article/:slug', {
    template: 'article',
    data: function () {
        return Articles.findOne({slug: this.params.slug});
    },
    onAfterAction: function () {
        var article = this.data();
        if (article) {
            document.title = article.title + Meteor.settings.public.seo.suffix;
        }
    }
});

Router.route('/article/:slug/edit', {
    template: 'editor',
    data: function () {
        return Articles.findOne({slug: this.params.slug});
    }
});
