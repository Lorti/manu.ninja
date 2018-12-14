var offsetY = 0;

var getTargetOffset = function getTargetOffset(hash) {
  var id = window.decodeURI(hash.replace("#", ""));

  if (id !== "") {
    var element = document.getElementById(id);

    if (element) {
      return element.offsetTop - offsetY;
    }
  }

  return null;
};

exports.onInitialClientRender = function (_, pluginOptions) {
  if (pluginOptions.offsetY) {
    offsetY = pluginOptions.offsetY;
  }

  requestAnimationFrame(function () {
    var offset = getTargetOffset(window.location.hash);

    if (offset !== null) {
      window.scrollTo(0, offset);
    }
  });
};

exports.shouldUpdateScroll = function (_ref) {
  var location = _ref.routerProps.location;
  var offset = getTargetOffset(location.hash);
  return offset !== null ? [0, offset] : true;
};
