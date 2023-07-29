import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const renderCategoryList = () => {
    const {categoryList} = props

    return categoryList.map(eachItem => {
      const {getCategoryItem} = props
      const onClickCategory = () => getCategoryItem(eachItem.categoryId)

      return (
        <li className="category-item" onClick={onClickCategory}>
          <p className="category-name">{eachItem.name}</p>
        </li>
      )
    })
  }

  const renderRatingsList = () => {
    const {ratingsList} = props

    return ratingsList.map(eachItem => {
      const {getRatingItem} = props
      const onClickRating = () => getRatingItem(eachItem.ratingId)

      return (
        <li className="category-item" onClick={onClickRating}>
          <img
            className="rating-img"
            alt={`rating ${eachItem.ratingId}`}
            src={eachItem.imageUrl}
          />
          <p className="category-name">& up</p>
        </li>
      )
    })
  }

  const onClickSearch = event => {
    const {getSearchInput} = props
    getSearchInput(event.target.value)
  }

  const afterClickEnter = event => {
    const {whenEntered} = props
    if (event.key === 'Enter') {
      whenEntered()
    }
  }

  const renderSearch = () => {
    const {searchInputEntered} = props

    return (
      <div className="search-input-container">
        <input
          onChange={onClickSearch}
          onKeyDown={afterClickEnter}
          type="search"
          className="search-input"
          value={searchInputEntered}
        />
        <BsSearch className="search-icon-image" />
      </div>
    )
  }

  const onClickClear = () => {
    const {clearFilters} = props
    clearFilters()
  }

  return (
    <div className="filters-group-container">
      <h1>Filters Group</h1>
      {renderSearch()}
      <h1 className="category-heading">Category</h1>
      {renderCategoryList()}
      <h1 className="category-heading">Rating</h1>
      {renderRatingsList()}

      <button
        onClick={onClickClear}
        className="clear-filters-button"
        type="button"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
