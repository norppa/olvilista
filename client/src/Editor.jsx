
import { useEffect, useState } from 'react'
import ImageSelector from './ImageSelector'
import { addReview, updateReview, deleteReview } from './api'

const Editor = (props) => {

    const [image, setImage] = useState(null)
    const [imageUpdated, setImageUpdated] = useState(false)
    const [subject, setSubject] = useState('')
    const [review, setReview] = useState('')

    useEffect(() => {
        setImage(props.existing?.image || null)
        setSubject(props.existing?.subject || '')
        setReview(props.existing?.review || '')
    }, [])

    useEffect(() => setImageUpdated(true), [image])

    const onSubmitClick = async () => {
        let formData = new FormData()
        formData.set('id', props.existing?.id)
        formData.set('subject', subject)
        formData.set('review', review)
        if (imageUpdated) formData.append('file', image)

        const result = props.existing ? await updateReview(formData) : await addReview(formData)
        if (result.error) return console.error(result.error)
        props.close()
    }

    const onRemoveClick = async () => {
        const confirm = window.confirm('Haluatko varmasti poistaa tämän arvostelun?')
        if (confirm) {
            let formData = new FormData()
            formData.set('id', props.existing?.id)
            await deleteReview(formData)
            props.close()
        }
    }

    return (
        <div className='Editor'>
            <ImageSelector image={image} setImage={setImage} />
            <input type='text'
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder='Mistä juomasta oli kyse?' />
            <textarea value={review}
                onChange={(event) => setReview(event.target.value)}
                placeholder='Ja miltä se maistui?'
                rows={10} />
            <div>
                {props.existing && <button onClick={onRemoveClick}>Poista</button>}
                <button onClick={props.close}>Peruuta</button>
                <button onClick={onSubmitClick}>{props.existing ? 'Päivitä' : 'Lähetä'}</button>

            </div>


        </div>
    )
}



export default Editor