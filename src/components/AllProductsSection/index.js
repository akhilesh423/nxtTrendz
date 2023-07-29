import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    categoryName: '',
    activeRatingId: '',
    searchInputEntered: '',
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeOptionId,
      categoryName,
      activeRatingId,
      searchInputEntered,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryName}&title_search=${searchInputEntered}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderNoProducts = () => (
    <div className="no-products-container">
      <img
        className="no-products-image"
        alt="no products"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
      />
      <h1>No Products Found</h1>
      <p>We Could not find any products. Try other filters</p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const isProductsFound = productsList.length === 0

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
        {isProductsFound ? this.renderNoProducts() : ''}
      </div>
    )
  }

  getCategoryItem = id => {
    this.setState({categoryName: id}, this.getProducts)
  }

  getRatingItem = id => {
    this.setState({activeRatingId: id}, this.getProducts)
  }

  whenEntered = () => {
    this.getProducts()
  }

  getSearchInput = searchInput => {
    this.setState({searchInputEntered: searchInput}, this.getProducts)
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        alt="products failure"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
      />
      <h1>Oops! Something Went Wrong </h1>
      <p>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  clearFilters = () => {
    this.setState(
      {
        categoryName: '',
        activeRatingId: '',
        searchInputEntered: '',
      },
      this.getProducts,
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)

    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderProductsList()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {activeRatingId, categoryName, searchInputEntered} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryList={categoryOptions}
          ratingsList={ratingsList}
          getCategoryItem={this.getCategoryItem}
          getRatingItem={this.getRatingItem}
          activeRatingId={activeRatingId}
          categoryName={categoryName}
          getSearchInput={this.getSearchInput}
          whenEntered={this.whenEntered}
          searchInputEntered={searchInputEntered}
          clearFilters={this.clearFilters}
        />

        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
