import swiperCss from '../common/css/swiper.min.css';
import horseraceCss from '../common/css/horserace.css';

import React from 'react';
import ReactDOM from 'react-dom';
import swiperJs from '../common/js/swiper.js';
import $ from 'jquery'
import common from '../common/js/common.js'
import horseraceModel from '../model/horserace-model.js'


export default class HorseraceIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  getInitialState() {
    return {
      email: ''
    }
  } 

  componentDidMount() {
    console.log(22)
    horseraceModel.shareFriends("", function(res) {

    }, function(res) {}, function(res) {});
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      parallax: true,
      speed: 600,
      noSwiping: true,
      onClick: function(swiper) {},
      onSlideChangeEnd: function(swiper) {}
    });


  }

  handleEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  render() {
    return ( < div className = "uuu" >
      < div className = "swiper-container" >
      < div className = "swiper-wrapper" >
      < div className = "swiper-slide" >
          556 bgbg 
      < /div> 
      < div className = "swiper-slide" >
          ssssssssssvfvf 
      < /div> 
      < div className = "swiper-slide" >
       vfvbgbb 
      < /div> 
       < /div> 
      < div className = "swiper-pagination swiper-pagination-white" > < /div> 
      < div className = "swiper-button-prev swiper-button-white" > < /div> 
      < div className = "swiper-button-next swiper-button-white" > < /div> 
      < /div>
       < /div>
    )
  }
};