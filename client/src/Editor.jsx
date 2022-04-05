
import { useEffect, useState } from 'react'
import ImageSelector from './ImageSelector'
import { saveBeer, updateBeer, deleteBeer, getUsers } from './api'

const Editor = (props) => {

    const [image, setImage] = useState(null)
    const [imageUpdated, setImageUpdated] = useState(false)

    const [beer, setBeer] = useState('')
    const [comment, setComment] = useState({comment: ''})
    const [users, setUsers] = useState([])
    const [selectedUserId, setSelectedUserId] = useState(null)

    useEffect(async () => {
        setImage(props.existing?.image || null)
        setBeer(props.existing?.beer || '')

        const users = await getUsers()
        setUsers(users)
        const userId = localStorage.getItem('@OlvilistaUser')
        const user = users.find(user => user.id == userId)
        if (users) {
            setSelectedUserId(userId)
            const selectedUserComment = props.existing.comments.find(comment => comment.user.id == userId)
            setComment(selectedUserComment ? selectedUserComment : { comment: '', user })
        } else if (props.existing) {
            setSelectedUserId(props.existing.comments[0].user.id)
            setComment(props.existing.comments[0])
        }
    }, [])

    const updateImage = (image) => {
        setImageUpdated(true)
        setImage(image)
    }

    const onSubmitClick = async () => {
        if (selectedUserId === null) return alert('Valitse kuka sä oot!')
        if (beer === '') return alert('Muista otsikko!')
        if (comment.comment === '') return alert('Et voi jättää tyhjää kommenttia.')

        const result = props.existing ? await update() : await create()
        if (result.error) return console.error(result.error)
        props.close()
    }

    const create = () => saveBeer(beer, image, selectedUserId, comment.comment)

    const update = async () => {
        const beerId = props.existing.id
        const beerValue = beer !== props.existing.beer ? beer : undefined
        const imageValue = image !== props.existing.image ? image : undefined

        const oldComment = props.existing.comments.find(comment => comment.user.id == selectedUserId)
        const commentValue = comment.comment !== oldComment?.comment ? comment.comment : undefined
        const commentId = (commentValue === undefined || oldComment === undefined) ? undefined : oldComment.id

        return await updateBeer(beerId, beerValue, imageValue, commentId, selectedUserId, commentValue)
    }

    const onRemoveClick = async () => {
        const confirm = window.confirm('Haluatko varmasti poistaa tämän oluen ja kaikki siihen liittyvät kommentit?')
        if (confirm) {
            await deleteBeer(props.existing.id)
            props.close()
        }
    }

    const onSelectUser = (user) => () => {
        localStorage.setItem('@OlvilistaUser', JSON.stringify(user.id))
        setSelectedUserId(user.id)
        if (props.existing) {
            const selectedUserComment = props.existing.comments.find(comment => comment.user.id == user.id)
            setComment(selectedUserComment ? selectedUserComment : { comment: '', user })
        }
    }

    return (
        <div className='Editor'>
            <ImageSelector image={image} setImage={updateImage} />
            <input type='text'
                value={beer}
                onChange={(event) => setBeer(event.target.value)}
                placeholder='Osuva otsikko' />
            <textarea value={comment.comment}
                onChange={(event) => setComment(oldcomment => ({ ...oldcomment, comment: event.target.value }))}
                placeholder='Kaunis kuvaus'
                rows={10} />
            <div className='users'>
                {users.map(user => (
                    <button key={`user${user.id}`} className={'userTag' + (selectedUserId == user.id ? ' selected' : '')}
                        style={{ backgroundColor: user.color }}
                        onClick={onSelectUser(user)}>
                        {user.user}
                    </button>))}
            </div>
            <div>
                {props.existing && <button onClick={onRemoveClick}>Poista</button>}
                <button onClick={props.close}>Peruuta</button>
                <button onClick={onSubmitClick}>{props.existing ? 'Päivitä' : 'Lähetä'}</button>

            </div>


        </div>
    )
}



export default Editor