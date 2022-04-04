import { useRef } from 'react'
import { RiCloseCircleFill } from 'react-icons/ri'

const ImageSelector = ({ image, setImage }) => {

    const imageUploadRef = useRef(null)
    
    const onClick = () => imageUploadRef.current.click()
    const onChange = (event) => setImage(event.target.files[0])
    const delImage = () => setImage(null)

    if (!image) return (
        <label className='Image selector' onClick={onClick}>
            <input type='file' ref={imageUploadRef} onChange={onChange} style={{ display: 'none' }} />
        </label>
    )
    const src = typeof image === 'string' ? image : URL.createObjectURL(image)

    if (image) return (
        <div className='Image'>
            <RiCloseCircleFill className='close' onClick={delImage} />
            <img className='beerImage' src={src} />
        </div>
    )

    
}

export default ImageSelector