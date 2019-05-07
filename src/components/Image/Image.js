import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      transformVal : 1,
      expand : 0,
      favorite : false
    };

    this.handleFlip = this.handleFlip.bind(this);
    this.expand = this.expand.bind(this);
    this.favoriteFunction = this.favoriteFunction.bind(this);
    
    // if (localStorage.hasOwnProperty(this.props.dto.id + '_state')) {
    //   this.state = JSON.parse(
    //     localStorage.getItem(this.props.dto.id + '_state')
    //   );
    // }
    localStorage.clear();
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleFlip(){
    var newDeg = this.state.transformVal * -1 ;
    this.setState({transformVal:newDeg});
  }
 
  expand(){
    if(this.state.expand == 0){
      this.setState({
        size : this.state.size*2,
        expand : 1
      });
    }else{
      this.setState({
        size : this.state.size/2,
        expand : 0
      });
      }
  }

  favoriteFunction(func,props){
    
    this.setState({
      favorite : this.state.favorite ? false : true
    },
    //() => { localStorage.setItem(this.props.dto.id + '_state', JSON.stringify(this.state)); }
    );
    func(props);
  }


  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: 'scale('+this.state.transformVal+ ',1)'
        }}
        
        >
        <div>
          <FontAwesome className="image-icon" name="arrows-alt-h" title="flip" onClick = {() => this.handleFlip()}/>
          <FontAwesome className="image-icon" name="clone" title="clone" onClick = {() => this.props.cloneHandler(this.props.dto)} />
          <FontAwesome className="image-icon" name="expand" title="expand" onClick = {() => this.expand()}/>
          <FontAwesome className="image-icon" name="heart" title="favorie" onClick = {() => this.favoriteFunction(this.props.favoriteHandler,this.props.dto)}
          style = {{color :  this.state.favorite ? 'red' : ''}} />

        </div>
      </div>
    );
  }
}

export default Image;
