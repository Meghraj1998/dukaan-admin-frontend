import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/layout";
import "../../styles/pages/admin/Products.scss";
import FieldWithElement from '../../components/FieldWithElement';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import controller from "../../controllers/admin/products.js";
import Loader from '../../components/loader';
import Pagination from "../../components/Pagination";

class Products extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      queryParams: {},
      results: [],
      pageInfoQuery: {
        page: 1,
        limit: 5
      },
      pagesInfo: {},
      loading: false,
      searchHidden: false
    };
    this.ReactSwal = withReactContent(Swal);
  }

  /**
   * Changes the value of the specified key in the queryParams object
   * in state.
   * @param {SyntheticEvent} event – Handles an event from a form
   * @example
   *  <input
   *   type="text"
   *   name="email"
   *   onChange={this.handleQueryParamChange}
   *  />
   *  // Changes the value of this.state.queryParams.email
   */
  handleQueryParamChange = (event) => {
    let newQueryParams = this.state.queryParams;
    newQueryParams[event.target.name] = event.target.value;
    this.setState(prevState => ({
      queryParams: newQueryParams
    }));
  };

  /**
   * Callback for page change
   * @param {int} offset
   */
  handleChangePage = (page) => {
    let pageInfoQuery = this.state.pageInfoQuery;
    pageInfoQuery['page'] = page;
    this.setState({
      pageInfoQuery
    });
    this.handleProductSearch();
  }

  /**
   * Toggles the visibility of search box
   */
  toggleSearch = () => {
    if (this.state.searchHidden) {
      this.setState({
        searchHidden: false
      });
    } else {
      this.setState({
        searchHidden: true
      });
    }
  }

  /**
   * Product search action method
   */
  handleProductSearch = () => {
    this.setState({
      loading: true,
      searchHidden: true
    })
    controller.handleGetProducts(this.state.queryParams, this.state.pageInfoQuery).then((response) => {
      this.setState({
        loading: false,
        results: response.results,
        pagesInfo: response.pagesInfo
      });
    }).catch((error) => {
      Swal.fire({
        type: 'error',
        title: 'Error while fetching products!',
        text: error
      });
      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Products" />
        <Layout />
        <div className={"d-flex align-items-center mr-5 pr-5"}>
          {/* Product Search */}
          {!this.state.searchHidden && 
            <div className={"d-flex col-4 mt-5 ml-5"}>
              <div className={"border-card product-search-card"}>
                
                {/* Title */}
                <div className={"d-flex justify-content-center mt-1 pb-3"}>
                  <h2 className={"title"}>
                      Search Products
                  </h2>
                </div>

                {/* Name */}
                <FieldWithElement
                  nameCols={3}
                  elementCols={9}
                  name={"Name"}
                >
                  <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Product Name"
                    name={"name"}
                    onChange={this.handleQueryParamChange}
                  />
                </FieldWithElement>

                {/* Results per page */}
                <FieldWithElement
                  name={"Results per page"}
                  nameCols={5}
                  elementCols={7}
                  elementClassName={"pl-4"}
                >
                  <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Results Per Page..."
                    name="limit"
                    defaultValue={5}
                    onChange={(event) => { 
                      let pageInfoQuery = this.state.pageInfoQuery;
                      pageInfoQuery['limit'] = event.target.value;
                      this.setState({
                        pageInfoQuery
                      });
                    }}
                  />
                </FieldWithElement>
                
                <div className={"d-flex justify-content-center"}>
                  <button
                    id="search"
                    className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                    onClick={this.handleProductSearch}
                  >
                    Search
                  </button>
                </div>

              </div>
            </div>
          }
          {/* Product Results */}
          {!this.state.loading && this.state.results.length > 0 &&
            <div className={`d-flex justify-content-center ml-5 mt-5 ${this.state.searchHidden ? 'col-md-12' : 'col-md-8'}`}>
              <div className={"border-card"}>
                {/* Title */}
                <div className={"d-flex justify-content-center mt-1"}>
                  <h2 className={"title"}>Products Results</h2>
                </div>
                {/* Results Table */}
                <div className={"c-overview-leaderboard coupons"}>
                  <table className={"table table-responsive products-results-table"}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>MRP</th>
                        <th>List Price</th>
                        <th>Display Slug</th>
                        <th>Listed</th>
                        <th>Edit</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.results.map(p => (
                          <tr>
                            <td className={"product-name"}>
                              <img src={p.image_url} className={"product-image"} align={"absmiddle"}></img>
                              <span className={"name"}>{p.name}</span>
                            </td>
                            <td className={"product-description"}>{p.description}</td>
                            <td>{p.mrp}</td>
                            <td>{p.list_price}</td>
                            <td>{p.display_slug}</td>
                            <td>{p.listed && "Yes"}{!p.listed && "No"}</td>
                            <td>Edit</td>
                            <td>View</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                {/* {
                  this.state.results.map(p => (
                      <div className={"product-card d-inline-block"}>
                        <img src={p.image_url}></img>
                        <div className={"name"}>{p.name}</div>
                        <div className={"description"}>{p.description}</div>
                      </div>
                    )
                  )
                } */}
                </div>
                <div className={"col-md-12 pt-4"}>
                  <Pagination 
                    pagesInfo={this.state.pagesInfo}
                    changePageCallback={this.handleChangePage}
                  />
                </div>
              </div>
            </div>
          }
          {/* Loader */}
          {this.state.loading &&
            <div className={"border-card mt-3 loading-container"}>
              <Loader />
            </div>
          }
          {/* Floating */}
          <div 
            className={"floating-button button-solid"}
            onClick={this.toggleSearch}
          >
            <i className={"fa fa-search"} />
          </div>
        </div>
      </div>
    );
  }

}

export default Products;