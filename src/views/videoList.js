import React, {Component} from 'react';
import {Card, Pagination} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../style/video.css';
import {api} from '../common/commonData';


export default class VideoList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curList: [],   //当前页列表
            current: parseInt(localStorage.getItem('videoPage')),    //当前页
            // pageIndex: 0,
            total: 0,
            pageSize: 20,
            videoData: [],   //视频列表
            curVideoIndex: 0,    //当前视频index
            tempPage: 0,    //页数跳转输入框
            isLike: false,
            isNotLike: false,
        }
        // this.localIndex = this.props.match.params.pageIndex;
    }

    componentDidMount() {
        // this.localIndex = this.props.match.params.pageIndex;
        // console.log("this.localIndex =" + this.localIndex);
        this.getUrl(this.state.current);
        // this.getUrl(this.localIndex);
        // this.jump(this.localIndex);
    }

    getUrl = (pageNumber) => {
        this.setState({
            current: pageNumber
        });
        axios.get(api + '/video/list/page', {
            params: {
                pageIndex: pageNumber,
                pageSize: 20
            }
        }).then((res) => {
            this.setState({
                curList: res.data.data,
                total: res.data.count,
                curVideoIndex: 0,
                tempPage: 0
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    jump = (id) => {
        localStorage.setItem('videoPage', this.state.current);
        this.props.history.push(`/video/play/${id}`);
    }

    onShowSizeChange = (current, newPageSize) => {
        this.setState({
            current: current,
            pageSize: newPageSize
        })
    }

    /**
     * 重新加载gif
     * @param e
     * @param url
     */
    reset = (e, url) => {
        e.target.src = url;
    }

    refreshGif = (e) => {

    }

    render() {
        console.log(this.state.current)
        return (
            <div className="cardList">
                <div>
                    {
                        this.state.curList.map(item => (
                            <Card bordered={true} style={{width: 300, marginTop: 20}} hoverable={true}
                                  key={item.name}
                                  onClick={() => this.jump(item.id)}
                                  title={item.name}
                                  cover={<img alt="example" src={item.image}
                                              onMouseMove={(e) => this.reset(e, item.image)}
                                              onPlaying={(e) => this.reset(e, item.image)}
                                              onTouchMove={(e) => this.reset(e, item.image)}
                                              onTouchStart={(e) => this.reset(e, item.image)}/>}
                                  type={'inner'}>
                                <div className="ls-title article-title">{item.name}</div>
                            </Card>
                        ))
                    }
                </div>
                <div className="ls-pageBox">
                    <Pagination current={this.state.current}
                                pageSize={this.state.pageSize}
                                showSizeChanger
                                onShowSizeChange={this.onShowSizeChange}
                                showQuickJumper total={this.state.total}
                                onChange={this.getUrl}/>
                </div>
            </div>
        );
    }
}