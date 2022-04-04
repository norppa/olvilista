import express from 'express'
import Database from 'better-sqlite3'
import multer from 'multer'

const db = Database('./db/olvilista.db')
const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.get('/api', (req, res) => {
    const result = db.prepare('SELECT id, subject, review, image FROM reviews').all()
    const response = result.map(row => {
        return { ...row, image: row.image?.toString('base64') }
    })
    res.send(response)
})

router.post('/api', upload.single('file'), (req, res) => {
    const result = db.prepare('INSERT INTO reviews (subject, review, image) VALUES (?,?,?)')
        .run(req.body.subject, req.body.review, req.file.buffer)
    res.json({})
})

router.put('/api', upload.single('file'), (req, res) => {
    const result = req.file?.buffer
        ? db.prepare('UPDATE reviews SET subject=?, review=?, image=? WHERE id=?')
            .run(req.body.subject, req.body.review, req?.file?.buffer, req.body.id)
        : db.prepare('UPDATE reviews SET subject=?, review=? WHERE id=?')
            .run(req.body.subject, req.body.review, req.body.id)
    res.json({})
})

router.delete('/api', upload.none(), (req, res) => {
    db.prepare('DELETE FROM reviews WHERE id=?').run(req.body.id)
    res.send()
})


router.use('/', express.static('./client/dist'))

export default router