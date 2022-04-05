const apiUrl = process.env.NODE_ENV === 'production' ? 'api' : 'http://localhost:3000/olvilista/api'

export const getBeers = async () => {
    const response = await fetch(apiUrl)
    return await response.json()
}

export const saveBeer = async (beer, image, userId, comment) => {
    const formData = new FormData()
    formData.set('beer', beer)
    formData.set('comment', comment)
    formData.set('userId', userId)
    formData.set('image', image)
    const response = await fetch(apiUrl, { method: 'POST', body: formData })
    return response.status === 200 ? {} : { error: response }
}

export const updateBeer = async (beerId, beer, image, commentId, userId, comment) => {
    if (beerId === undefined && commentId === undefined && comment === undefined) return {}

    const formData = new FormData()
    if (beerId !== undefined) formData.set('beerId', beerId)
    if (beer !== undefined) formData.set('beer', beer)
    if (image !== undefined) formData.set('image', image)
    if (commentId !== undefined) formData.set('commentId', commentId)
    if (userId !== undefined) formData.set('userId', userId)
    if (comment !== undefined) formData.set('comment', comment)
    const response = await fetch(apiUrl, { method: 'PUT', body: formData })
    return response.status === 200 ? {} : { error: response }
}

export const deleteBeer = async (beerId) => {
    const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: beerId })
    })
    return {}
}

export const getUsers = async () => {
    const response = await fetch(apiUrl + '/users')
    return await response.json()
}

export const addUser = async (user) => {
    const response = await fetch(apiUrl + '/users', {
        method: 'POST',
        body: user
    })
}