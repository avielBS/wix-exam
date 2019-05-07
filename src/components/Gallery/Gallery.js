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
      favoriteList : [],
      pageNumber : 1
    };

    this.cloneImage = this.cloneImage.bind(this);
    this.addToFavoriteList = this.addToFavoriteList.bind(this);
    this.deleteImage = this.deleteImage.bind(this);


    // if (localStorage.hasOwnProperty('galleryState')) {
    //   this.state = JSON.parse(localStorage.getItem('galleryState'));
    // }
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${this.state.pageNumber}&format=json&safe_search=1&nojsoncallback=1`;
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
            this.setState({images: [...this.state.images ,... res.photos.photo] });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  cloneImage(dto){
  
    let tempImages = this.state.images;
    let clonedImage = Object.assign({}, dto);
    let index = tempImages.findIndex(image =>  image.id == dto.id);
    tempImages.splice(index,0,clonedImage);
    this.setState({images : tempImages});

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
    this.setState({ favoriteList: tempFavorite });
    // //,
    // () => {
    //   localStorage.setItem('galleryState', JSON.stringify(this.state));
    // });
  }




  onScroll = () => {

    if (
      (window.innerHeight + document.documentElement.scrollTop) >= (document.body.offsetHeight - 200) ) {
        this.setState({pageNumber : this.state.pageNumber++});
        this.getImages(this.props.tag);
    }
  }

  deleteImage(dto){
    let tempImages = this.state.images;
    let index = this.state.images.findIndex((image) => image.id == dto.id );
    tempImages.splice(index,1);
    this.setState({images:tempImages});
  }


  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto,index) => {
          return <Image key={index} dto={dto} galleryWidth={this.state.galleryWidth} cloneHandler={this.cloneImage} favoriteHandler = {this.addToFavoriteList} deleteHandler = {this.deleteImage} />;
        })}
      </div>
    );
  }
}

export default Gallery;
