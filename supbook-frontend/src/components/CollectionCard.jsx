const collectionCard = ({ collection, onDelete, onRemoveBook }) => {
    const id = collection.id
    const name = collection.attributes?.name || collection.name
    const books = collection.attributes?.books?.data || collection.books || []

    return (
        <div className="collection-card">
      <div className="collection-header">
        <h3 className="collection-name">{name}</h3>
        <button
          className="collection-delete-btn"
          onClick={() => onDelete(id)}
        >
          Supprimer
        </button>
      </div>

      <div className="collection-books">
        {books.length === 0 ? (
          <p className="collection-empty">Aucun livre dans cette collection</p>
        ) : (
          books.map((book) => {
            const bookTitle = book.attributes?.title || book.title
            return (
              <div key={book.id} className="collection-book-item">
                <span>{bookTitle}</span>
                <button
                  onClick={() => onRemoveBook(id, book.id)}
                >
                  ✕
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
    )
}

export default collectionCard