import React, { Component } from 'react';
import { Link, Prompt } from 'react-router-dom';

import { PRODUCTS } from '../../routes';
import { withFirebase } from '../Firebase';

class ProductForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      isBlocking: false,
      upload: null,
      progress: 0,

      businessID: '',
      Title: '',
      Price: 0.00,
      Description: '',
      Status: 'OPEN',

      productImageName: '',
      productImageURL: '',
    };
    this.state = this.initialState;
  }

  onCreateProduct = () => {
    let ownerName = this.props.authUser.username;
    let ownerID = this.props.authUser.uid;

    // let { businessID, productID, floorID, roomID } = this.state;
    // let { productTitle, productDescription, productStatus, productServiceType, productImageName, productImageURL } = this.state;
    let { productTitle, productDescription, productPrice, productServiceType, productImageName, productImageURL } = this.state;

    var productData = {
      seller: { ownerName, ownerID },
      image: { productImageName, productImageURL },
      productTitle,
      productPrice,
      productDescription,
      // productStatus,
      productServiceType,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    }

    let productID = this.props.firebase.createProduct(productData);
    console.log(productID);
    this.setState(this.initialState);
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      isBlocking: event.target.value.length > 0,
    });
  };

  // onAutoFill = () => {
  //   this.setState({
  //     isBlocking: true,
  //     businessID: '-MNIVFlXAdfjwAIEslMH',
  //     productID: '-MNIWgqfPJFOqVVPFLCA',
  //     floorID: '-MNIaKm56aa5l5mHaV5-',
  //     roomID: '-MNIkOqcBsUhDz2IhflB',
  //   });
  // };


  handleChange = (e) => {
    if (e.target.files[0]) {
      const upload = e.target.files[0];
      const uploadTask = this.props.firebase.storage.ref(`images/${upload.name}`).put(upload);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // progress function ...
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.setState({ progress });
        },
        (error) => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          this.props.firebase.storage
            .ref(`images`)
            .child(upload.name)
            .getDownloadURL()
            .then((image_url) => {
              this.setState({ image_url, image_name: upload.name });
            });
        },
      );
    }
  };


  render() {
    const { isBlocking, progress } = this.state;
    const {
      // businessID,
      // productID,
      // floorID,
      // roomID,

      productTitle,
      productPrice,
      productDescription,
      productServiceType,
    } = this.state;

    return (
      <div className=" text-center">
        <hr />
        <h2>Create A Product!</h2>
        <form>
          {/* <div className="form-row">
            <input
              className="form-input col-5"
              type="text"
              placeholder="Business ID"
              name="businessID"
              value={businessID}
              onChange={this.onChange}
            />
            <input
              className="form-input col-5"
              type="text"
              placeholder="Product ID"
              name="productID"
              value={productID}
              onChange={this.onChange}
            />
          </div>
          <div className="form-row">
            <input
              className="form-input col-5"
              type="text"
              placeholder="Floor ID"
              name="floorID"
              value={floorID}
              onChange={this.onChange}
            />
            <input
              className="form-input col-5"
              type="text"
              placeholder="Room ID"
              name="roomID"
              value={roomID}
              onChange={this.onChange}
            />
          </div>

          {process.env.NODE_ENV !== 'production' &&
            <div className="btn btn-primary form-input" onClick={this.onAutoFill}>
              Auto Fill Location
            </div>
          } */}

          <div className="form-row">
            <input
              className="form-input col-10"
              type="text"
              placeholder="Product Title"
              name="productTitle"
              value={productTitle}
              onChange={this.onChange}
            />
            <input
            className="form-input col-10"
            type="number"
            placeholder="Product Price"
            name="productPrice"
            value={productPrice}
            onChange={this.onChange}
          />
          </div>

          <textarea
            rows="3"
            className="form-input col-12"
            type="text"
            placeholder="Product Description"
            name="productDescription"
            value={productDescription}
            onChange={this.onChange}
          />

          <select className="form-control" name="productServiceType" value={productServiceType} onChange={this.onChange}>
            <option value="">Select a Service</option>
            <option value="CATEGORY 1">CATEGORY 1</option>
            <option value="CATEGORY 2">CATEGORY 2</option>
            <option value="CATEGORY 3">CATEGORY 3</option>
          </select>

          <input className="file-uploader" type="file" onChange={this.handleChange} />

          <p className='text-center'>
            Photo Upload Progress:
            <progress value={progress} max="100" className="progress" />
          </p>
        </form>

        <Prompt when={isBlocking} message={(location) => `Are you sure you want to go to ${location.pathname}`} />
        {/* <p>Blocking? {isBlocking ? 'Yes, click a link or the back button' : 'Nope'}</p> */}

        <button className="btn btn-primary" type="submit" onClick={this.onCreateProduct}>
          <Link to={PRODUCTS}>Submit Product</Link>
        </button>
      </div>
    );
  }
}

export default withFirebase(ProductForm);
