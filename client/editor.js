Template.editor.helpers({
    preview: function () {
        return Session.get('preview');
    }
});
Template.editor.events({
    'input textarea, focus textarea': function (event) {
        Session.set('preview', event.target.value);
        resizeTextarea(event.target)
    },
    'submit form': function (event) {
        event.preventDefault();
        var data = {
            _id: event.target._id.value,
            title: event.target.title.value,
            category: event.target.category.value,
            content: event.target.content.value
        };
        if (data._id) {
            Meteor.call('updateArticle', data);
        } else {
            Meteor.call('insertArticle', data);
            Router.go('/article/' + slugify(data.title));
        }
    }
});

function resizeTextarea(element) {
    var style = window.getComputedStyle(element);
    var offset;

    if (style.boxSizing === 'content-box') {
        offset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
    } else {
        offset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    }

    element.style.height = 'auto';
    element.style.height = element.scrollHeight + offset + 'px';
}
