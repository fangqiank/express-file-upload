import path from 'path'

export const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const fileExtensions = []

    Object.keys(req.files).forEach((key) => {
      fileExtensions.push(path.extname(req.files[key].name))
    })

    const allowed = fileExtensions.every((ext) => {
      return allowedExtArray.includes(ext)
    })

    if (!allowed) {
      const message = `Upload failed. Only ${allowedExtArray.toString()} files are allowed.`

      return res.status(422).json({
        status: 'error',
        message,
      })
    }

    next()
  }
}
