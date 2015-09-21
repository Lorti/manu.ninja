Template.editor.helpers({
    previewTitle: function () {
        return Session.get('previewTitle');
    },
    previewCategory: function () {
        return Session.get('previewCategory');
    },
    previewContent: function () {
        return Session.get('previewContent');
    }
});

Template.editor.events({
    'input [name="title"], focus [name="title"]': function (event) {
        Session.set('previewTitle', event.target.value)
    },
    'input [name="category"], focus [name="category"]': function (event) {
        Session.set('previewCategory', event.target.value)
    },
    'input textarea, focus textarea': function (event) {
        Session.set('previewContent', event.target.value);
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
