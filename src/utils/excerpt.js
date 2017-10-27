import cheerio from 'cheerio'

export default function(html) {
  const $ = cheerio.load(html)
  return $('p')
    .first()
    .text()
}
