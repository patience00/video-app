import React, {Component} from 'react';
import {Icon, InputNumber, Button, Tag, Row, Select} from 'antd';
import {api} from '../common/commonData';
import axios from 'axios';
import '../style/video.css';
import videoList from "./videoList";
// import Player from 'griffith';

export default class VideoPlay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: '',   //当前视频url
            curTags: [],   //当前视频tag
            name: '',
            score: 0.0,    //当前视频评分
            tempPage: 0,    //页数跳转输入框
            curScore: '',    //当前视频好评率
            isLike: false,
            isNotLike: false,
            playRate: 1,
            chooseTag: [],
            curId: 0

        }
        this.tags = [];

        const id = this.props.match.params.id;
        this.idStack = [];
        this.idStack.push(id);
        this.colorArray = ['magenta',
            'red',
            'volcano',
            'orange',
            'lime',
            'green',
            'cyan',
            'blue',
            'geekblue',
            'purple'];
    }

    componentDidMount() {
        this.getVideo();
        this.timerId = setInterval(() => this.heartBeat(), 5000);
    }


    componentWillUnmount() {
        clearInterval(this.timerId)
    }


    getChooseTags = (value) => {
        const tags = this.state.chooseTag;
        console.log("选择的tag:", tags);
        tags.splice(0, tags.length);
        this.setState({
            chooseTag: value,
        })
    }

    tagVideo = () => {
        const id = this.idStack[0];
        this.setState({curId: id})
        console.log("视频id:" + id);

        console.log("已存在tag:", this.state.curTags);
        console.log("添加tag:", this.state.chooseTag);
        let allTag = this.state.chooseTag.concat(this.state.curTags);
        console.log("所有tag:", allTag);
        axios.put(api + '/video/tag', {
            id: id,
            tags: this.state.chooseTag
        })
            .then((response) => {
                this.setState({
                    curTags: allTag
                })
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    getVideo = () => {
        const id = this.idStack[0];
        this.setState({curId: id})
        console.log("视频id:" + id);
        const that = this;
        axios.get(api + '/video/' + id, {})
            .then((response) => {
                console.log(this);
                that.setState({
                    url: response.data.data.url,
                    name: response.data.data.name,
                    curTags: response.data.data.tags
                })
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    heartBeat() {
        console.log("beat:", new Date());
        axios.get(api + '/video/heartbeat', {}).then((res) => {
        }).catch(function (error) {
            console.log(error);
        });
    }

    lastVideo = () => {

        var nowId = this.idStack.pop();
        var lastId = nowId - 1;
        this.idStack.push(lastId);
        // this.props.history.push('/video/play/' + lastId)
        this.setState({curId: lastId})
        console.log("视频id:" + lastId);
        axios.get(api + '/video/' + lastId, {})
            .then((response) => {
                this.setState({
                    url: response.data.data.url
                })
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    nextVideo = () => {
        var nowId = this.idStack.pop();
        var nextId = nowId + 1;
        this.idStack.push(nextId);
        // this.props.history.push('/video/play/' + nextId);
        this.setState({curId: nextId})
        console.log("视频id:" + nextId);
        axios.get(api + '/video/' + nextId, {})
            .then((response) => {
                this.setState({
                    url: response.data.data.url
                })
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    up = () => {
        this.setState({
            isLike: true
        });
        axios.post(api + '/video/rate', {
            id: this.state.curId,
            downOrUp: 1
        });
        this.setState({
            score: 1
        });
    }

    delete = () => {
        console.log("id:", this.props.match.params.id);
        axios.get(api + '/video/delete', {
            params: {
                id: this.props.match.params.id
            }
        })
            .then(function (response) {
                alert(response.data.message);
                console.log(response);
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    // 关机
    shutdown = () => {
        axios.get(api + '/video/shut')
            .then(function (response) {
                console.log(response);
                if (response.status === 200 && response.data.data === 'ok') {
                    alert("一分钟后关机");
                }
            })
            .catch(function (response) {
                alert("关机失败");
                console.log(response);
            });
    }

    down = () => {
        this.setState({
            isNotLike: true
        });
        axios.post(api + '/video/rate', {
            id: this.state.curId,
            downOrUp: 1
        });
        this.setState({
            score: 0
        });
    }


    playrate = (value) => {
        this.setState({
            playRate: value
        })
    }


    render() {
        let offsetWidth = document.querySelector('body').offsetWidth;
        return (
            <div className="videoContainer">
                <h2>{this.state.name}</h2>
                {
                    this.state.url
                        ?
                        // <Player id={this.props.match.params.id}
                        //           sources={{
                        //               hd: {
                        //                   play_url: this.state.url
                        //               },
                        //               sd: {
                        //                   play_url: this.state.url,
                        //               },
                        //           }}
                        //           defaultQuality='hd'
                        // />
                        <video src={this.state.url} controls width={offsetWidth}></video>
                        : null
                }
                <div>好评率：{this.state.curScore}%</div>
                <div className="video-mt20">
                    <Icon type="like" style={{fontSize: '35px', color: '#08c'}}
                          theme={!this.state.isLike ? 'outlined' : 'filled'} onClick={this.up}/>
                    <Icon type="dislike" style={{fontSize: '35px', color: '#08c'}}
                          theme={!this.state.isNotLike ? 'outlined' : 'filled'} onClick={this.down}/>

                </div>
                <span>播放速度:</span>
                <InputNumber min={1} max={2} step={0.5} defaultValue={1} onChange={this.playrate}/>
                <div className="video-mt20 btn-box">
                    <Button type="primary" onClick={this.lastVideo}>上一个</Button>
                    <Button type="primary" onClick={this.nextVideo}>下一个</Button><span>  </span>
                    <Button type="primary" onClick={this.delete}>删除</Button>
                    <Button type="primary" onClick={this.shutdown}>关机</Button>
                </div>
                <div className="tag-list">
                    {
                        this.state.curTags != null ? this.state.curTags.map(item => (
                            <Tag color={this.colorArray[Math.floor(Math.random() * 10)]}>{item}</Tag>
                        )) : null
                    }
                </div>

                <div className="write-tags">
                    <Select mode="tags" style={{width: '100%', size: "large"}} placeholder="标签"
                            onChange={this.getChooseTags}>
                        {this.tags}
                    </Select>
                </div>
                <Button type="primary" onClick={this.tagVideo}>提交</Button>
            </div>
        )
    }
}

//使用线性表实现
function Stack() {
    var stack = [];
    this.push = element => stack.push(element);
    this.pop = () => stack.pop();
    this.length = () => stack.length;
    this.top = () => {
        if (stack.length) {
            return stack[stack.length - 1];
        }
        return "stack empty"
    }
    this.clear = () => {
        stack.length = 0;
        return true;
    }
    this.toString = () => {
        if (stack.length) {
            stack.reverse();
            return stack.join(" ");
        }
        return "stack empty"

    }
}
