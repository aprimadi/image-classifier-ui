const fs = require('fs')
const remove = require('remove')
const path = require('path')

let baseDir = path.join(__dirname, "..", "data")

function pad(n) {
  let z = '0'
  let width = 3
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

let imageId = 0
while (imageId < 842000) {
  imageId++

  let _id = imageId
  let mil = pad(Math.floor(_id / 1000000))
  _id = _id % 1000000
  let tho = pad(Math.floor(_id / 1000))
  _id = _id % 1000
  let one = pad(_id)

  let dir = `${baseDir}/${mil}/${tho}/${one}/small`
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      if (file == "base64.txt") {
        try {
          remove.removeSync(dir)
          console.log('remove:', dir)
        } catch(err) {
          console.error(err)
        }
      }
    })
  }
}
