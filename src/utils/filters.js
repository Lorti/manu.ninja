const { DateTime } = require('luxon');
const { mapTaxonomy } = require('./taxonomy');
const stripTags = require('striptags');
const wordCount = require('wordcount');

function stripCommentTags(html) {
  return html.replace(/(<!--|-->)/g, '');
}

function separateThousands(number) {
  return number.toLocaleString('en-IN');
}

function length(html) {
  const words = wordCount(stripTags(stripCommentTags(html)));
  const minutes = Math.floor(words / 240);
  let string = '';
  if (!minutes) {
    string = '½ Minute';
  } else {
    string = `${separateThousands(minutes)}`;
    if (minutes > 1) {
      string += ' Minutes';
    } else {
      string += ' Minute';
    }
  }
  string += ` / ${separateThousands(words)} Words`;
  return string;
}

module.exports = {
  length,
  taxonomy: mapTaxonomy,
  readableDate(date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('LLL dd, yyyy');
  },
  htmlDateString(date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  },
  slug(url) {
    return url.replace(/(\/)/g, '');
  },
  safeTitleWrap(title) {
    const tokens = title.split(' ');
    const end = [tokens.pop(), tokens.pop()];
    return (
      tokens.join(' ') +
      (end[0].length + end[1].length < 10 ? '&nbsp;' : ' ') +
      end[1] +
      '&nbsp;' +
      end[0]
    );
  },
};
