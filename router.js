import express from 'express'
import Database from 'better-sqlite3'
import multer from 'multer'

const db = Database('./db/olvilista.db')
const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.get('/api', (req, res) => {
    const result = db.prepare('SELECT b.id AS beerId, beer, image, c.id AS commentId, user_id, user, color, comment FROM beers AS b LEFT JOIN comments AS c ON c.beer_id = b.id LEFT JOIN users AS u ON u.id = c.user_id').all()

    const beersWithComments = result.reduce((acc, cur) => {
        const beer = acc[cur.beerId] || {
            id: cur.beerId,
            beer: cur.beer,
            image: cur.image === 'null' ? null : cur.image?.toString('base64'),
            comments: []
        }
        beer.comments.push({
            id: cur.commentId,
            comment: cur.comment,
            user: { id: cur.user_id, user: cur.user, color: cur.color }
        })
        return { ...acc, [cur.beerId]: beer }
    }, {})

    res.send(Object.values(beersWithComments))
})

router.post('/api', upload.single('image'), (req, res) => {
    const transaction = db.transaction(() => {
        const result = createBeer(req.body.beer, req.file?.buffer)
        createComment(req.body.comment, result.lastInsertRowid, req.body.userId)
    })
    transaction()
    res.send()
})

router.put('/api', upload.single('image'), (req, res) => {
    const { beerId, beer, comment, commentId, userId } = req.body
    const image = req.file ? req.file.buffer : req.body.image
    const transaction = db.transaction(() => {
        if (beer !== undefined || image !== undefined) updateBeer(req.body.beerId, req.body.beer, image)
        if (commentId !== undefined) updateComment(req.body.comment, req.body.commentId) 
        else if (comment !== undefined) createComment(comment, beerId, userId)
    })

    transaction()
    res.send()

})

const createBeer = (beer, image) => {
    return db.prepare('INSERT INTO beers (beer, image) VALUES (?,?)').run(beer, image)
}

const updateBeer = (beerId, beer, image) => {
    if (beer === undefined) return db.prepare('UPDATE beers SET image=? WHERE id=?').run(image, beerId)
    if (image === undefined) return db.prepare('UPDATE beers SET beer=? WHERE id=?').run(beer, beerId)
    return db.prepare('UPDATE beers SET beer=?, image=? WHERE id=?').run(beer, image, beerId)
}

const createComment = (comment, beerId, userId) => {
    return db.prepare('INSERT INTO comments (beer_id, user_id, comment) VALUES (?,?,?)').run(beerId, userId, comment)
}

const updateComment = (comment, commentId) => {
    return db.prepare('UPDATE comments set comment=? WHERE id=?').run(comment, commentId)
}

router.delete('/api', (req, res) => {
    const result = db.prepare('DELETE FROM beers WHERE id=?').run(req.body.id)
    res.send()
})

router.get('/api/users', (req, res) => {
    const result = db.prepare('SELECT * FROM users').all()
    res.send(result)
})


router.use('/', express.static('client/dist'))

export default router
