const fs = require('fs')
const _ = require('lodash')

const sequelize = require(".")

function pad(n) {
  let z = '0'
  let width = 3
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

function base64encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}

class ImageWalker {
  constructor(dir) {
    this.dir = dir
  }

  //
  // @return [
  //   { base64: ..., imageId: 1 },
  //   { base64: ..., imageId: 3 },
  // ]
  //
  async walk(lastImageId, limit, skipExist) {
    let result = []
    let count = 0
    let imageId = lastImageId || 0
    while (count < limit && imageId < 842000) {
      imageId++

      if (skipExist) {
        let result = await sequelize.query(`SELECT image_id FROM images WHERE image_id = ${imageId}`, {
          type: sequelize.QueryTypes.SELECT,
          raw: true
        })
        if (_.values(result[0])[0]) {
          continue
        }
      }

      let _id = imageId
      let mil = pad(Math.floor(_id / 1000000))
      _id = _id % 1000000
      let tho = pad(Math.floor(_id / 1000))
      _id = _id % 1000
      let one = pad(_id)

      let dir = `${this.dir}/${mil}/${tho}/${one}/small`
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
          let base64 = base64encode(`${dir}/${file}`)
          result.push({ base64: base64, imageId: imageId })
          count++
        })
      }
    }
    return result
  }
}

module.exports = ImageWalker
