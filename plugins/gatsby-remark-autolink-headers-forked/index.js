var toString = require("mdast-util-to-string");

var visit = require("unist-util-visit");

var slugs = require("github-slugger")();

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value;
  }

  return context[key];
}

// !!!
var svgIcon = require("./icon");

module.exports = function (_ref, _ref2) {
  var markdownAST = _ref.markdownAST;
  var _ref2$icon = _ref2.icon,
      icon = _ref2$icon === void 0 ? svgIcon : _ref2$icon,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? "anchor" : _ref2$className,
      _ref2$maintainCase = _ref2.maintainCase,
      maintainCase = _ref2$maintainCase === void 0 ? false : _ref2$maintainCase;
  slugs.reset();
  visit(markdownAST, "heading", function (node) {
    var id = slugs.slug(toString(node), maintainCase);
    var data = patch(node, "data", {});
    patch(data, "id", id);
    patch(data, "htmlAttributes", {});
    patch(data, "hProperties", {});
    patch(data.htmlAttributes, "id", id);
    patch(data.hProperties, "id", id);

    if (icon !== false) {
      // !!!
      node.children.push({
        type: "link",
        url: "#" + id,
        title: null,
        data: {
          hProperties: {
            "aria-hidden": true,
            class: className
          },
          hChildren: [{
            type: "raw",
            // The Octicon link icon is the default. But users can set their own icon via the "icon" option.
            value: icon
          }]
        }
      });
    }
  });
  return markdownAST;
};
