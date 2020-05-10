import React, {Component} from 'react';
import {Icon, InputNumber} from 'antd';
import {api} from '../common/commonData';
import axios from 'axios';
import '../style/video.css';


export default class VideoPlay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: '',   //当前视频url
            name: '',
            score: 0.0,    //当前视频评分
            tempPage: 0,    //页数跳转输入框
            curScore: '',    //当前视频好评率
            isLike: false,
            isNotLike: false,
            playRate: 1,
        }
    }

    componentDidMount() {
        this.getVideo();
    }

    getVideo = () => {
        const id = this.props.match.params.id;
        console.log("视频id:" + id);
        axios.get(api + '/video/' + id, {})
            .then((response) => {
                this.setState({
                    url: response.data.url
                })
            })
            .catch(function (response) {
                console.log(response);
            });
    }
    //
    // lastVideo = () => {
    //     if (this.state.curVideoIndex === 0) {
    //         message.info('已经是第一个')
    //     } else {
    //         this.setState({
    //             url: this.state.videoData[this.state.curVideoIndex - 1].url,
    //             curVideoIndex: this.state.curVideoIndex - 1,
    //             curScore: this.state.videoData[this.state.curVideoIndex - 1].rate,
    //             tempPage: this.state.curVideoIndex - 1,
    //             score: 0,
    //             isLike: false,
    //             isNotLike: false
    //         });
    //         console.log(this.state.isLike);
    //     }
    // }
    //
    // nextVideo = () => {
    //     if (this.state.curVideoIndex === this.state.videoData.length - 1) {
    //         message.info('已经是最后一个')
    //     } else {
    //         this.setState({
    //             url: this.state.videoData[this.state.curVideoIndex + 1].url,
    //             curVideoIndex: this.state.curVideoIndex + 1,
    //             curScore: this.state.videoData[this.state.curVideoIndex + 1].rate,
    //             tempPage: this.state.curVideoIndex + 1,
    //             score: 0,
    //             isLike: false,
    //             isNotLike: false
    //         });
    //     }
    // }

    up = () => {
        this.setState({
            isLike: true
        });
        console.log(this);
        axios.post(api + '/video/rate', {
            id: this.state.videoData[this.state.curVideoIndex].id,
            downOrUp: 1
        });
        this.setState({
            score: 1
        });
    }

    delete = () => {
        var params = new URLSearchParams();
        params.append('id', this.state.videoData[this.state.curVideoIndex].id);
        axios.get(api + '/video/delete', params)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    // 关机
    shutdown = () => {
        axios.get(api + '/video/shutdown')
            .then(function (response) {
                console.log(response);
            })
            .catch(function (response) {
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
        axios.post(api + '/video/rate', {
            id: this.state.videoData[this.state.curVideoIndex].id,
            downOrUp: 0
        });
        this.setState({
            score: 0
        });
        // }
    }

    //
    // jumpTo = () => {
    //     let val = this.state.tempPage;
    //     if (val < 1) {
    //         message.info('请输入正确页码');
    //     } else if (val > this.state.videoData.length) {
    //         message.info('请输入正确页码');
    //     } else {
    //         this.setState({
    //             url: this.state.videoData[val].url,
    //             curVideoIndex: val,
    //             curScore: this.state.videoData[val].rate,
    //             score: 0,
    //             isLike: false,
    //             isNotLike: false
    //         });
    //     }
    // }
    //
    // changePage = (val) => {
    //     this.setState({
    //         tempPage: val - 1
    //     });
    // }

    playrate = (value) => {
        this.setState({
            playRate: value
        })
    }


    render() {

        return (
            <div className="videoContainer">
                {
                    this.state.url
                        ? <video width="50%" src={this.state.url} controls></video>
                        // ? <ReactPlayer url={this.state.url}
                        //                controls={true}
                        //                style={{margin: '0 auto'}}
                        //                width={720}
                        //                playbackRate={this.state.playRate}
                        // />
                        : null
                }
                <div>好评率：{this.state.curScore}%</div>
                <div className="video-mt20">
                    {/* <Rate allowHalf value={this.state.score} onChange={this.changeScore}/> */}
                    <Icon type="like" style={{fontSize: '35px', color: '#08c'}}
                          theme={!this.state.isLike ? 'outlined' : 'filled'} onClick={this.up}/>
                    <Icon type="dislike" style={{fontSize: '35px', color: '#08c'}}
                          theme={!this.state.isNotLike ? 'outlined' : 'filled'} onClick={this.down}/>

                </div>
                <span>播放速度:</span>
                <InputNumber min={1} max={2} step={0.5} defaultValue={1} onChange={this.playrate}/>
                <div className="video-mt20">
                    {/*<Button type="primary" onClick={this.lastVideo}>上一个</Button>*/}
                    {/*<span className="video-a-bSpan">{this.state.curVideoIndex + 1}</span>/<span*/}
                    {/*className="video-a-bSpan">{this.state.videoData.length}</span>*/}
                    {/*<Button type="primary" onClick={this.nextVideo}>下一个</Button><span>  </span>*/}
                    {/*<Button type="primary" onClick={this.delete}>删除</Button>*/}
                    {/*<Button type="primary" onClick={this.shutdown}>关机</Button>*/}
                </div>
                {/*<div className="video-mt20">*/}
                {/*    跳转到：<InputNumber value={this.state.tempPage + 1} onChange={this.changePage}/>*/}
                {/*    <Button type="primary" onClick={this.jumpTo} className="video-a-bSpan">跳转</Button>*/}
                {/*</div>*/}
            </div>
        )
    }
}