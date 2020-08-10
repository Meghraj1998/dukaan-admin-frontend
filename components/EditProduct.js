import React from 'react';
import FieldWithElement from './FieldWithElement';
import controller from '../controllers/products';
import Loader from './loader';
import ImageChooser from './ImageChooser';

class EditProduct extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      queryParams: props.product || {},
      productInfo: props.product || {},
      errorMessage: ''
    };
  }

  componentDidMount() {
    let queryParams = this.state.queryParams;
    queryParams.referral = false;
    queryParams.campaign = false;
    queryParams.listed = JSON.parse(queryParams.listed);
    this.setState({
      queryParams
    })
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
   * Handle checkbox change
   * @param {SyntheticEvent} event – Handles the checkbox change event
   */

  handleCheckboxChange = (event) => {
    let newQueryParams = this.state.queryParams;
    newQueryParams[event.target.name] = event.target.checked;
    this.setState(prevState => ({
      queryParams: newQueryParams
    }));
  }

  /**
   * Custom Validations for the edit form
   * @return {boolean} isValid – Returns a bool that tells
   *  if the form passed validation
   */

  customValidations = () => {
    if (!document.getElementById("editProductForm").checkValidity()) {
      document.getElementById("editProductForm").reportValidity();
      return false;
    } else {
      return true;
    }
  }

  /**
   * Method to handle saving of product
   * @param {SyntheticEvent} e – Handles the form submission
   */
  handleSaveProduct = (e) => {
    e.preventDefault();
    if (this.customValidations()) {
      this.setState({
        loading: true,
        errorMessage: ''
      });
      controller.handleEditProduct(this.state.queryParams).then((response) => {
        if (response) {
          this.setState({
            loading: false,
            errorMessage: ''
          });
          let productInfo = this.state.queryParams;
          productInfo.id = this.state.productInfo.id;
          this.props.callback(productInfo);
        }
      }).catch((error) => {
        this.setState({
          loading: false,
          errorMessage: error
        });
      });
    }
  }

  render() {
    return (
      <div>
        <div className={"d-flex align-items-center justify-content-center"}>
          <div className={"col-md-12 mt-5"}>
            {this.state.loading &&
              <Loader />
            }
            {!this.state.loading &&
              <div className={"edit-product-card"}>
                {/* Title */}
                <div className={"d-fleex justify-content-center mt-1 pb-3"}>
                  <h2 className={"title"}>Edit Product</h2>
                </div>
                {this.state.errorMessage.length != 0 &&
                  <div className={"red justify-content-center mt-1 pb-3"}>
                    {this.state.errorMessage}
                  </div>
                }
                <form id="editProductForm">
                  {/* Product Name */}
                  <FieldWithElement name={"Product Name"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type={"text"}
                      className={"input-text"}
                      placeholder="Enter Product Name"
                      name="name"
                      defaultValue={this.state.productInfo.name}
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"Description"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type={"text"}
                      className={"input-text"}
                      placeholder="Enter Description"
                      name="description"
                      multiline={true}
                      defaultValue={this.state.productInfo.description}
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"Display Slug"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type={"text"}
                      className={"input-text"}
                      placeholder="Enter Display Slug"
                      name="display_slug"
                      multiline={true}
                      defaultValue={this.state.productInfo.display_slug}
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"MRP"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type={"text"}
                      className={"input-text"}
                      placeholder="Enter Maximum Retail Price"
                      name="mrp"
                      multiline={true}
                      defaultValue={this.state.productInfo.mrp}
                      onChange={this.handleQueryParamChange}
                      title="MRP should be a number of 3 to 10 digits"
                      pattern={"[0-9]{3,10}"}
                      required
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"List Price"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type={"text"}
                      className={"input-text"}
                      placeholder="Enter List Price"
                      name="list_price"
                      multiline={true}
                      defaultValue={this.state.productInfo.list_price}
                      onChange={this.handleQueryParamChange}
                      pattern={"[0-9]{3,10}"}
                      title="List Price should be a number of 3 to 10 digits"
                      required
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"Image URL"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <img
                      src={this.state.queryParams.image_url}
                      width={100}
                      height={100}
                    />
                    <div className={`pb-3`}>
                      <input
                        type={"text"}
                        className={"input-text"}
                        placeholder="Enter Image URL"
                        name="image_url"
                        defaultValue={this.state.queryParams.image_url}
                        onChange={this.handleQueryParamChange}
                        required
                      />
                    </div>
                    <ImageChooser
                      callback={(image_url) => {
                        let queryParams = this.state.queryParams;
                        queryParams.image_url = image_url;
                        this.setState({
                          queryParams
                        });
                      }}
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"Redirect URL"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type={"text"}
                      className={"input-text"}
                      placeholder="Enter Redirect URL"
                      name="redirect_url"
                      multiline={true}
                      defaultValue={this.state.productInfo.redirect_url}
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>
                  <FieldWithElement name={"Type"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <select
                      name="type"
                      defaultValue={this.state.productInfo.type}
                      onChange={this.handleQueryParamChange}
                      required
                    >
                      <option value="course">Course</option>
                      <option value="test">Test</option>
                    </select>
                  </FieldWithElement>
                  <div className={"checkboxes"}>
                    <input
                      type="checkbox"
                      onChange={this.handleCheckboxChange}
                      checked={this.state.queryParams.is_offline}
                      name="is_offline"
                      value="Is Offline?" />Is Offline?
                    <input
                      type="checkbox"
                      onChange={this.handleCheckboxChange}
                      checked={this.state.queryParams.listed}
                      name="listed"
                      value="Listed?" />Listed?
                  </div>

                  <div className={"d-flex justify-content-center"}>
                    <div
                      id="search"
                      className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                      onClick={this.handleSaveProduct}
                    >
                      Save
                    </div>
                  </div>
                </form>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }

}

export default EditProduct;
