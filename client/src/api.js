const apiUrl = process.env.NODE_ENV === 'production' ? 'api' : 'http://localhost:3000/olvilista/api'

export const getReviews = async () => {
    const response = await fetch(apiUrl)
    return await response.json()
}

export const addReview = async (formData) => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })
    return await response.json()
}

export const updateReview = async (formData) => {
    const response = await fetch(apiUrl, {
        method: 'PUT',
        body: formData,
    })
    return await response.json()
}

export const deleteReview = async (formData) => {
    const response = await fetch(apiUrl, {
        method: 'DELETE',
        body: formData
    })
    return {}
}