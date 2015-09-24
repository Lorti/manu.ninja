Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'index',
    template: 'index',
    data: function () {
        return {articles: Articles.find({}, {sort: {createDate: -1}})};
    }
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
        if (!Meteor.isClient) {
            return;
        }
        var article = this.data();
        SEO.set({
            title: article.title + ' | ' + SEO.settings.title,
            meta: {
                'description': article.description
            },
            og: {
                'title': article.title,
                'description': article.description
            }
        });
    }
});

Router.route('/article/:slug/edit', {
    template: 'editor',
    data: function () {
        return Articles.findOne({slug: this.params.slug});
    }
});

Router.route('/category/:category', {
    template: 'articles',
    data: function () {
        return {articles: Articles.find({category: this.params.category}, {sort: {createDate: -1}})};
    }
});
