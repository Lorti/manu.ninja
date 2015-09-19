if (Meteor.isClient) {
    Meteor.subscribe('articles');

    Meteor.startup(function () {
        return SEO.config({
            title: 'manu.ninja | Front-End Development, Games and Digital Art',
            meta: {
                'description': 'The personal blog of front-end ninja and digital artist Manuel Wieser, where I talk about front-end development, games and digital art.'
            },
            og: {
                'image': '/manu.jpg'
            }
        });
    });
}
