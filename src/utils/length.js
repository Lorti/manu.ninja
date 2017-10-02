import stripTags from 'striptags'
import wordCount from 'wordcount'

function getWords(html) {
  return wordCount(stripTags(html))
}

function getMinutes(words) {
  return Math.round(words / 240)
}

function separateThousands(number) {
  return number.toLocaleString('en-IN')
}

export default function(html) {
  const words = getWords(html)
  const minutes = getMinutes(words)
  let string = ''
  if (minutes === 0) {
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
