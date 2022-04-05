import { useEffect, useState, useRef } from 'react'
import Editor from './Editor'

import { getBeers } from './api'
import beerImg from './assets/beer.png'
import './OlviLista.css'

const Pages = { MAIN: 'MAIN', EDITOR: 'EDITOR' }

const toDateString = (date) => {
  let day = date.substring(8, 10)
  let month = date.substring(5, 7)
  let year = date.substring(0, 4)
  if (day.charAt(0) === '0') day = day.substring(1)
  if (month.charAt(0) === '0') month = month.substring(1)
  return `${day}.${month}.${year}`
}

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
            {beer.comments.map(({ id, user, comment, date }) => <p key={`comment${id}`}>
              {comment}
              <div className='commentSignature'>
                &#8226;
                <span className='userTag' style={{ backgroundColor: user.color }}>
                  {user.user.toUpperCase()}
                </span>
                {toDateString(date)}
              </div>
            </p>)}
          </div>
        })}
      </div>


    </div>
  )
}

export default BrewReport