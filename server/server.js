Meteor.publish('articles', function () {
    return Articles.find();
});

Meteor.methods({
    'insertArticle': function (data) {
        if (!this.userId) {
            throw new Meteor.Error(401);
        }

        Articles.insert({
            title: data.title,
            slug: slugify(data.title),
            category: data.category.toLowerCase(),
            content: data.content,
            createDate: new Date(),
            changeDate: new Date()
        });
    },
    'updateArticle': function (data) {
        if (!this.userId) {
            throw new Meteor.Error(401);
        }

        Articles.update(data._id, {
            $set: {
                title: data.title,
                slug: slugify(data.title),
                category: data.category.toLowerCase(),
                content: data.content,
                changeDate: new Date()
            }
        });
    },
    'removeArticle': function (id) {
        if (!this.userId) {
            throw new Meteor.Error(401);
        }

        Articles.remove(id);
    }
});
