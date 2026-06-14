import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  fetchCollections,
  createCollection,
  addBookToCollection,
  removeBookFromCollection,
  deleteCollection,
} from '../api/collections'
import { fetchBooks } from '../api/books'
import CollectionCard from '../components/CollectionCard'

const CollectionsPage = () => {
  const { token } = useAuth()

  const [collections, setCollections] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedBook, setSelectedBook] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [collectionsData, booksData] = await Promise.all([
          fetchCollections(token),
          fetchBooks(token),
        ])
        setCollections(collectionsData)
        setBooks(booksData)
      } catch {
        setError('Impossible de charger les données')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [token])

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return
    try {
      await createCollection(token, newCollectionName.trim())
      const updatedCollections = await fetchCollections(token)
      setCollections(updatedCollections)
      setNewCollectionName('')
    } catch {
      setError('Erreur lors de la création de la collection')
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!selectedCollection || !selectedBook) return
    try {
      const collection = collections.find(
        (c) => String(c.documentId || c.id) === String(selectedCollection)
      )
      const currentBooks =
        collection.attributes?.books?.data || collection.books || []
      const currentBookIds = currentBooks.map((b) => b.documentId || b.id)

      if (currentBookIds.includes(selectedBook)) return

      const updatedBookIds = [...currentBookIds, selectedBook]
      const documentId = collection.documentId || collection.id
      await addBookToCollection(token, documentId, updatedBookIds)
      const updatedCollections = await fetchCollections(token)
      setCollections(updatedCollections)
    } catch {
      setError("Erreur lors de l'ajout du livre")
    }
  }

  const handleRemoveBook = async (collectionId, bookId) => {
    try {
      const collection = collections.find(
        (c) => String(c.documentId || c.id) === String(collectionId)
      )
      const currentBooks =
        collection.attributes?.books?.data || collection.books || []
      const updatedBookIds = currentBooks
        .map((b) => b.documentId || b.id)
        .filter((id) => id !== bookId)

      const documentId = collection.documentId || collection.id
      await removeBookFromCollection(token, documentId, updatedBookIds)
      const updatedCollections = await fetchCollections(token)
      setCollections(updatedCollections)
    } catch {
      setError('Erreur lors du retrait du livre')
    }
  }

  const handleDeleteCollection = async (collectionId) => {
    try {
      const collection = collections.find(
        (c) => String(c.documentId || c.id) === String(collectionId)
      )
      const documentId = collection.documentId || collection.id
      await deleteCollection(token, documentId)
      setCollections((prev) => prev.filter((c) => c.id !== collectionId))
    } catch {
      setError('Erreur lors de la suppression')
    }
  }

  return (
    <div className="collections-page">
      <header className="library-header">
        <h1>Mes Collections 📂</h1>
        <a href="/library">← Bibliothèque</a>
      </header>

      <main className="collections-content">
        {loading && <p className="loading">Chargement...</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleCreateCollection} className="create-collection-form">
          <input
            type="text"
            placeholder="Nom de la collection"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <button type="submit">Créer une collection</button>
        </form>

        <form onSubmit={handleAddBook} className="add-book-form">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="">Choisir une collection</option>
            {collections.map((c) => (
              <option key={c.id} value={c.documentId || c.id}>
                {c.attributes?.name || c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">Choisir un livre</option>
            {books.map((b) => (
              <option key={b.id} value={b.documentId || b.id}>
                {b.attributes?.title || b.title}
              </option>
            ))}
          </select>

          <button type="submit">Ajouter à la collection</button>
        </form>

        {collections.length === 0 && !loading && (
          <p className="empty-library">Aucune collection créée.</p>
        )}

        <div className="collections-grid">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={handleDeleteCollection}
              onRemoveBook={handleRemoveBook}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default CollectionsPage