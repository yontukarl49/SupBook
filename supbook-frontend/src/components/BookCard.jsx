const BookCard = ({ book, onDelete }) => {
  // Compatible Strapi v4 et v5
  const id = book.id
  const title = book.attributes?.title || book.title
  const description = book.attributes?.description || book.description
  const coverUrl = book.attributes?.coverUrl || book.coverUrl
  const readingStatus = book.attributes?.readingStatus || book.readingStatus
  const rating = book.attributes?.rating || book.rating
  const authorName =
    book.attributes?.author?.data?.attributes?.name ||
    book.author?.name ||
    'Auteur inconnu'

  return (
    <div className="book-card">
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="book-cover" />
      ) : (
        <div className="book-cover-placeholder">📚</div>
      )}

      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{authorName}</p>

        {readingStatus && (
          <span className={`book-status book-status--${readingStatus}`}>
            {readingStatus === 'toRead' && 'À lire'}
            {readingStatus === 'reading' && 'En cours'}
            {readingStatus === 'finished' && 'Terminé'}
          </span>
        )}

        {rating && <p className="book-rating">{'⭐'.repeat(rating)}</p>}

        {description && <p className="book-description">{description}</p>}
      </div>

      <button className="book-delete-btn" onClick={() => onDelete(id)}>
        Supprimer
      </button>
    </div>
  )
}

export default BookCard