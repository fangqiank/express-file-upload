import express from 'express'
import 'dotenv/config'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

import { fileExtLimiter } from './middleware/fileExtLimit.js'
import { fileSizeLimiter } from './middleware/fileSizeLimiter.js'
import { filesPayloadExists } from './middleware/filePayloadExists.js'

const PORT = process.env.PORT || 3500

const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post(
  '/upload',
  fileUpload({
    createParentPath: true,
  }),
  filesPayloadExists,
  fileExtLimiter(['.JPG', '.JPEG', '.PNG']),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files
    console.log({ files })

    Object.keys(files).forEach((key) => {
      const filePath = path.join(__dirname, 'files', files[key].name)
      files[key].mv(filePath, (err) => {
        if (err)
          return res.status(500).json({
            status: 'error',
            message: err.message,
          })
      })
    })

    return res.json({
      status: 'success',
      message: Object.keys(files).toString() + ' files uploaded successfully',
    })
  },
)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
