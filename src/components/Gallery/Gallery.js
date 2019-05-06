import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      favoriteList : []
    };

    this.cloneImage = this.cloneImage.bind(this);
    this.addToFavoriteList = this.addToFavoriteList.bind(this);


    if (localStorage.hasOwnProperty('galleryState')) {
      this.state = JSON.parse(localStorage.getItem('galleryState'));
    }
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  cloneImage(img){

    let clonedImage = Object.assign({}, img);
    let tmpImages = this.state.images;
    let index = tmpImages.findIndex(image =>  image.id == img.id);
    
    let id = Math.floor(Math.random() * 50000);
    clonedImage.id += id;
    
    let firstSlice = tmpImages.slice(0, index + 1);
    let lastSlice = tmpImages.slice(index + 1, tmpImages.length + 1);
    
    tmpImages = [...firstSlice, clonedImage, ...lastSlice];

    this.setState(
      {
        images: tmpImages
      });
  
  }

  addToFavoriteList(dto){
    let favoriteImageIndex = this.state.images.findIndex((image) => image.id == dto.id);
    let tempFavorite = this.state.favoriteList;
    let favoriteImage = this.state.images[favoriteImageIndex];

    if ( tempFavorite.findIndex(image => image.id == favoriteImage.id) == -1 ){
      tempFavorite = [... tempFavorite , favoriteImage];
    }
    else{
      let favoriteImageIndexInTemp = tempFavorite.findIndex(image => image.id == favoriteImage.id)
      tempFavorite = [... tempFavorite.slice(0,favoriteImageIndexInTemp) , ...tempFavorite.slice(favoriteImageIndexInTemp+1,favoriteImageIndexInTemp.length)]
    }
    this.setState({ favoriteList: tempFavorite },() => {
      localStorage.setItem('galleryState', JSON.stringify(this.state));
    });
    alert(tempFavorite);
  }



  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} favoriteHandler = {this.addToFavoriteList}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
