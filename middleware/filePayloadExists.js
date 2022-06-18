export const filesPayloadExists = (req, res, next) => {
  if (req.files) {
    next()
  } else {
    res.status(400).json({
      status: 'error',
      message: 'No files were uploaded',
    })
  }
}
