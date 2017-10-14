import stripTags from 'striptags'
import wordCount from 'wordcount'

function sanitizeComments(html) {
  return html.replace(/(<!--|-->)/g, '');
}

function getWords(html) {
  return wordCount(stripTags(sanitizeComments(html)))
}

function getMinutes(words) {
  return Math.floor(words / 240)
}

function separateThousands(number) {
  return number.toLocaleString('en-IN')
}

export default function(html) {
  const words = getWords(html)
  const minutes = getMinutes(words)
  let string = ''
  if (!minutes) {
    string = '½ Minute'
  } else {
    string = `${separateThousands(minutes)}`
    if (minutes > 1) {
      string += ' Minutes'
    } else {
      string += ' Minute'
    }
  }
  string += ` / ${separateThousands(words)} Words`
  return string
}
