import { useEffect, useState } from 'react'
import Editor from './Editor'

import { getReviews } from './api'
import './OlviLista.css'

const Pages = { MAIN: 'MAIN', EDITOR: 'EDITOR' }

const BrewReport = () => {
  const [page, setPage] = useState(Pages.MAIN)
  const [reviews, setReviews] = useState([])
  const [editee, setEditee] = useState(null)

  useEffect(() => {
    initialize()
    window.addEventListener('dblclick', dblclick)
    return () => window.removeEventListener('dblclick', dblclick)
  }, [])

  const dblclick = (event) => {
    const reviewDiv = event.target.closest('.Olvi')
    if (!reviewDiv) return null

    const id = Number(reviewDiv.id)
    const image = reviewDiv.children[0].src
    const subject = reviewDiv.children[1].innerHTML
    const review = reviewDiv.children[2].innerHTML

    setEditee({ id, image, subject, review })
    setPage(Pages.EDITOR)
  }

  const initialize = async () => {
    const reviews = await getReviews()
    if (reviews.error) return console.error(reviews.error)
    setReviews(reviews)
    setEditee(null)
  }

  const closeEditor = () => {
    initialize()
    setPage(Pages.MAIN)
  }

  if (page === Pages.EDITOR) return <Editor close={closeEditor} existing={editee} />

  return (
    <div id='OlviLista'>
      <h1>Olvilista</h1>
      <button id='addButton' onClick={() => setPage(Pages.EDITOR)}>Lisää uusi arvostelu</button>
      <div className='olvit'>
        {reviews.map(review => {
          return <div key={review.id} id={review.id} className='Olvi'>
            <img src={`data:image/*;base64,${review.image}`} />
            <h2>{review.subject}</h2>
            <p>{review.review}</p>
          </div>
        })}
      </div>


    </div>
  )
}

export default BrewReport