import React, {Component} from 'react';
import {Card, Pagination} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../style/video.css';
import {api} from '../common/commonData';


export default class VideoList extends Component {

    constructor() {
        super();
        this.state = {
            curList: [],   //当前页列表
            current: 1,    //当前页
            // pageIndex: 0,
            pageNumber: 0,
            pageSize: 20,
            videoData: [],   //视频列表
            curVideoIndex: 0,    //当前视频index
            tempPage: 0,    //页数跳转输入框
            isLike: false,
            isNotLike: false,
        }
        this.timer = null;
    }

    componentDidMount() {
        this.getUrl(1);
    }

    getUrl = (pageNumber) => {
        axios.get(api + '/video/list/page', {
            params: {
                pageIndex: pageNumber,
                pageSize: 20
            }
        }).then((res) => {
            this.setState({
                curList: res.data.data,
                pageNumber: res.data.count,
                curVideoIndex: 0,
                tempPage: 0
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    jump = (pageNumber) => {
        this.setState({
            current: pageNumber
        })
        this.getUrl(pageNumber);
    }

    onShowSizeChange = (current, newPageSize) => {
        this.setState({
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
        return (
            <div className="cardList">
                <div>
                    {
                        this.state.curList.map(item => (
                            <Link to={`/video/play/${item.id}`}>
                                <Card bordered={true} style={{width: 300, marginTop: 20}} hoverable={true}
                                      key={item.name}
                                      title={item.name}
                                      cover={<img alt="example" src={item.image}
                                                  onMouseMove={(e) => this.reset(e, item.image)}
                                                  onPlaying={(e) => this.reset(e, item.image)}
                                                  onTouchMove={(e) => this.reset(e, item.image)}
                                                  onTouchStart={(e) => this.reset(e, item.image)}/>}
                                      type={'inner'}>
                                    <div className="ls-title article-title">{item.name}</div>
                                </Card>
                            </Link>
                            // </div>
                        ))
                    }
                </div>
                <div className="ls-pageBox">
                    <Pagination pageSize={this.state.pageSize}
                                showSizeChanger
                                onShowSizeChange={this.onShowSizeChange}
                                showQuickJumper total={this.state.pageNumber}
                                onChange={this.jump}/>
                </div>
            </div>
        )
    }
}