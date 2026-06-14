import { useState, useEffect, } from 'react'
import { createAuthor, fetchAuthors } from '../api/authors'
import { useAuth } from '../context/AuthContext'

const AddBookModal = ({ onClose, onBookAdded }) => {
    const { token } = useAuth()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [coverUrl, setCoverUrl] = useState('')
    const [publishedYear, setPublishedYear] = useState('')
    const [readingStatus, setReadingStatus] = useState('toRead')
    const [rating, setRating] = useState('')
    const [review, setReview] = useState('')

    const [authors, setAuthors] = useState([])
    const [selectedAuthorId, setSelectedAuthorId] = useState('')
    const [newAuthorName, setNewAuthorName] = useState('')
    const [showNewAuthor, setShowNewAuthor] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

  useEffect(() => {
  const loadAuthors = async () => {
    try {
      const data = await fetchAuthors(token)
      setAuthors(Array.isArray(data) ? data : [])
    } catch {
      setAuthors([])
    }
  }
  loadAuthors()
}, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let authorId = selectedAuthorId

      if (showNewAuthor && newAuthorName.trim()) {
        const newAuthor = await createAuthor(token, newAuthorName.trim())
        authorId = newAuthor.id
      }

      const bookData = {
        title,
        description,
        coverUrl,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        readingStatus,
        rating: rating ? parseInt(rating) : null,
        review,
        author: authorId || null,
      }

      onBookAdded(bookData)
      onClose()
    } catch {
      setError("Erreur lors de l'ajout du livre")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Ajouter un livre</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL de la couverture"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          <input
            type="number"
            placeholder="Année de publication"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />

          {/* Sélection du statut de lecture */}
          <select
            value={readingStatus}
            onChange={(e) => setReadingStatus(e.target.value)}
          >
            <option value="toRead">À lire</option>
            <option value="reading">En cours</option>
            <option value="finished">Terminé</option>
          </select>

          {/* Note */}
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Pas de note</option>
            <option value="1">⭐ 1</option>
            <option value="2">⭐⭐ 2</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>

          <textarea
            placeholder="Votre avis"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          {/* Sélection de l'auteur */}
          {!showNewAuthor ? (
            <div>
              <select
                value={selectedAuthorId}
                onChange={(e) => setSelectedAuthorId(e.target.value)}
              >
                <option value="">Sélectionner un auteur</option>
              {authors.map((author) => (
  <option key={author.id} value={author.id}>
    {author.attributes?.name || author.name}
  </option>
))}  
              </select>
              <button
                type="button"
                onClick={() => setShowNewAuthor(true)}
              >
                + Nouvel auteur
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Nom de l'auteur"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewAuthor(false)}
              >
                Choisir un auteur existant
              </button>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal 