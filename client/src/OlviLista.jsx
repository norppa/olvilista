import { useEffect, useState, useRef } from 'react'
import Editor from './Editor'

import { getBeers } from './api'
import beerImg from './assets/beer.png'
import './OlviLista.css'

const Pages = { MAIN: 'MAIN', EDITOR: 'EDITOR' }

const BrewReport = () => {
  const [page, setPage] = useState(Pages.MAIN)
  const [beers, setBeers] = useState([])
  const [editee, setEditee] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    initialize()
    window.addEventListener('dblclick', dblclick)
    return () => window.removeEventListener('dblclick', dblclick)
  }, [])

  const dblclick = (event) => {
    const beerDiv = event.target.closest('.beer')
    if (!beerDiv) return null

    const beerId = Number(beerDiv.id)
    const beer = ref.current.find(beer => beer.id == beerId)

    setEditee(beer)
    setPage(Pages.EDITOR)
  }

  const initialize = async () => {
    const beers = await getBeers()
    if (beers.error) return console.error(beers.error)
    ref.current = beers
    setBeers(beers)
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
      <div className='beers'>
        {beers.map(beer => {
          return <div key={beer.id} id={beer.id} className='beer'>
            {beer.image
              ? <img src={`data:image/*;base64,${beer.image}`} />
              : <img src={beerImg} className='beerImgPlaceholder' />}

            <h2>{beer.beer}</h2>
            {beer.comments.map(({ id, user, comment }) => <p key={`comment${id}`}>
              <span className='userIcon' style={{ backgroundColor: user.color }}>
                {user.user.substring(0, 1).toUpperCase()}
              </span>
              {comment}
            </p>)}
          </div>
        })}
      </div>


    </div>
  )
}

export default BrewReport