import React, { Component } from 'react';
import { Icon } from 'antd';
import { Button, Rate, message, InputNumber } from 'antd';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoData: [],   //视频列表
      url: null,   //当前视频url
      curVideoIndex: 0,    //当前视频index
      score: 0.0,    //当前视频评分
      tempPage: 0,    //页数跳转输入框
      curScore: '',    //当前视频好评率
      isLike: false,
      isNotLike: false,
    }
  }

  componentDidMount() {
    this.getUrl();
  }

  getUrl = () => {
    axios
      .get("http://192.168.1.101:8090/video/list")
      .then(res => {
        this.setState({
          videoData: res.data,
          url: res.data[0].url,
          curVideoIndex: 0,
          curScore: res.data[0].rate,
          tempPage: 0
        });
      })
  }

  lastVideo = () => {
    if (this.state.curVideoIndex === 0) {
      message.info('已经是第一个')
    } else {
      this.setState({
        url: this.state.videoData[this.state.curVideoIndex - 1].url,
        curVideoIndex: this.state.curVideoIndex - 1,
        curScore: this.state.videoData[this.state.curVideoIndex - 1].rate,
        tempPage: this.state.curVideoIndex - 1,
        score: 0,
        isLike: false,
        isNotLike: false
      });
      console.log(this.state.isLike);
    }
  }

  nextVideo = () => {
    if (this.state.curVideoIndex === this.state.videoData.length - 1) {
      message.info('已经是最后一个')
    } else {
      this.setState({
        url: this.state.videoData[this.state.curVideoIndex + 1].url,
        curVideoIndex: this.state.curVideoIndex + 1,
        curScore: this.state.videoData[this.state.curVideoIndex + 1].rate,
        tempPage: this.state.curVideoIndex + 1,
        score: 0,
        isLike: false,
        isNotLike: false
      });
    }
  }

  up = () => {
    // if(this.state.score===0){
    //   message.info('请点亮星星');
    // }else{

    this.setState({
      isLike: true
    });
    console.log(this);
    axios.post('http://192.168.1.101:8090/video/rate', {
      id: this.state.videoData[this.state.curVideoIndex].id,
      downOrUp: 1
    });
    this.setState({
      score: 1
    });
    // }
  }

  delete = () => {
    var params = new URLSearchParams();
      params.append('id', this.state.videoData[this.state.curVideoIndex].id);
    axios.get('http://192.168.1.101:8090/video/delete',params)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(response) {
      console.log(response);
    });
  }

  down = () => {
    // if(this.state.score===0){
    //   message.info('请点亮星星');
    // }else{
      this.setState({
        isNotLike: true
      });
    axios.post('http://192.168.1.101:8090/video/rate', {
      id: this.state.videoData[this.state.curVideoIndex].id,
      downOrUp: 0
    });
    this.setState({
      score: 0
    });
    // }
  }

  // changeScore = (val) => {
  //   console.log(val);
  //   this.setState({
  //     score: val
  //   });
  // }

  jumpTo = () => {
    let val = this.state.tempPage;
    if (val < 1) {
      message.info('请输入正确页码');
    } else if (val > this.state.videoData.length) {
      message.info('请输入正确页码');
    } else {
      this.setState({
        url: this.state.videoData[val].url,
        curVideoIndex: val,
        curScore: this.state.videoData[val].rate,
        score: 0,
        isLike: false,
        isNotLike: false
      });
    }
  }

  changePage = (val) => {
    this.setState({
      tempPage: val - 1
    });
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        {
          this.state.url
            ? <video width="500px" src={this.state.url} autoPlay controls></video>
            : null
        }
        <div>好评率：{this.state.curScore}%</div>
        <div className="cjy-mt20">
          {/* <Rate allowHalf value={this.state.score} onChange={this.changeScore}/> */}
          <Icon type="like" style={{ fontSize: '35px', color: '#08c' }} theme={!this.state.isLike ? 'outlined' : 'filled'} onClick={this.up} />
          <Icon type="dislike" style={{ fontSize: '35px', color: '#08c' }} theme={!this.state.isNotLike ? 'outlined' : 'filled'} onClick={this.down} />

        </div>
        <div className="cjy-mt20">
          <Button type="primary" onClick={this.lastVideo}>上一个</Button>
          <span className="cjy-a-bSpan">{this.state.curVideoIndex + 1}</span>/<span className="cjy-a-bSpan">{this.state.videoData.length}</span>
          <Button type="primary" onClick={this.nextVideo}>下一个</Button><span>  </span>
          <Button type="primary" onClick={this.delete}>删除</Button>
        </div>
        <div className="cjy-mt20">
          跳转到：<InputNumber value={this.state.tempPage + 1} onChange={this.changePage} />
          <Button type="primary" onClick={this.jumpTo} className="cjy-a-bSpan">跳转</Button>
        </div>
      </div>
    );
  }
}

export default App;
