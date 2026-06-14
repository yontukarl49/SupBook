import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchBooks, createBook, deleteBook } from '../api/books'
import BookCard from '../components/BookCard'
import AddBookModal from '../components/AddBookModal'

const LibraryPage = () => {
  const { token, user, logout } = useAuth()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks(token)
        console.log('Premier livre:', JSON.stringify(data[0]))// Log du premier livre pour inspection
        setBooks(data)
      } catch {
        setError('Impossible de charger les livres')
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [token])

  const handleBookAdded = async (bookData) => {
    try {
      const newBook = await createBook(token, bookData)
      setBooks((prev) => [...prev, newBook])
    } catch {
      setError("Erreur lors de l'ajout du livre")
    }
  }
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(token, bookId)
      setBooks((prev) => prev.filter((book) => book.id !== bookId))
    } catch {
      setError('Erreur lors de la suppression')
    }
  }
  const filteredBooks = books.filter((book) => {
  const title = book.attributes?.title || book.title || ''
  const status = book.attributes?.readingStatus || book.readingStatus || ''
  
  const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesStatus = statusFilter === 'all' || status === statusFilter
  return matchesSearch && matchesStatus
})

  return (
    <div className="library-page">
      {/* Header */}
      <header className="library-header">
        <h1>SupBook 📚</h1>
        <div className="header-actions">
          <span>Bonjour, {user?.username}</span>
          <a href="/collections">mes collections</a>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      </header>

      {/* Barre d'outils */}
      <div className="library-toolbar">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous</option>
          <option value="toRead">À lire</option>
          <option value="reading">En cours</option>
          <option value="finished">Terminé</option>
        </select>
        <button onClick={() => setShowModal(true)}>+ Ajouter un livre</button>
      </div>

      {/* Contenu principal */}
      <main className="library-content">
        {/* Indicateur de chargement */}
        {loading && <p className="loading">Chargement...</p>}

        {/* Message d'erreur */}
        {error && <p className="error">{error}</p>}

        {/* Message si bibliothèque vide */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="empty-library">
            <p>Votre bibliothèque est vide.</p>
            <button onClick={() => setShowModal(true)}>
              Ajouter votre premier livre
            </button>
          </div>
        )}

        {/* Grille de livres */}
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      </main>

      {/* Modale d'ajout */}
      {showModal && (
        <AddBookModal
          onClose={() => setShowModal(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  )
}

export default LibraryPage