import React, {Component} from 'react';
import {Card, Icon, Pagination} from 'antd';
import axios from 'axios';
import '../style/video.css';
import {api} from '../common/commonData';


export default class VideoList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curList: [],   //当前页列表
            current: parseInt(localStorage.getItem('videoPage') == null ? 1 : localStorage.getItem('videoPage')),    //当前页
            // pageIndex: 0,
            total: 0,
            pageSize: 20,
            videoData: [],   //视频列表
            curVideoIndex: 0,    //当前视频index
            tempPage: 0,    //页数跳转输入框
            isLike: false,
            isNotLike: false,
            orderField: 'up',
            orderType: 'DESC',
        }
        // this.localIndex = this.props.match.params.pageIndex;
    }

    componentDidMount() {
        // this.localIndex = this.props.match.params.pageIndex;
        // console.log("this.localIndex =" + this.localIndex);
        this.getUrl(this.state.current, this.state.orderType, this.state.orderField);
        // this.getUrl(this.localIndex);
        // this.jump(this.localIndex);
        this.timerId = setInterval(() => this.heartBeat(), 5000);
    }
    
    
    componentWillUnmount() {
        clearInterval(this.timerId)
    }

     heartBeat() {
        console.log("beat:", new Date());
        axios.get(api + '/video/heartbeat', {}).then((res) => {
        }).catch(function (error) {
            console.log(error);
        });
    }

    changeSortField = (orderField, orderType) => {
        console.log("排序:" + orderField + "+" + orderType);
        this.getUrl(this.state.current, orderType, orderField);
    };

    changePageSize = (pageNumber) => {
        this.getUrl(pageNumber, this.state.orderType, this.state.orderField);
    }

    getUrl = (pageNumber, orderType, orderField) => {
        this.setState({
            current: pageNumber
        });
        axios.get(api + '/video/list/page', {
            params: {
                pageIndex: pageNumber,
                pageSize: 20,
                orderType: orderType,
                orderField: orderField
            }
        }).then((res) => {
            this.setState({
                curList: res.data.data.data,
                total: res.data.data.count,
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
                <div className="sortBox">
                    <div className="sortField">
                        <span>创建时间</span>
                        <div className="sortFont">
                            <a href="#" onClick={() => this.changeSortField('createTime', 'ASC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-up-filling"></use>
                                </svg>
                            </a>
                            <a href="#" onClick={() => this.changeSortField('createTime', 'DESC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-down-filling"></use>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="sortField">
                        <span>好评</span>
                        <div className="sortFont">
                            <a href="#" onClick={() => this.changeSortField('up', 'ASC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-up-filling"></use>
                                </svg>
                            </a>
                            <a href="#" onClick={() => this.changeSortField('up', 'DESC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-down-filling"></use>
                                </svg>
                            </a>

                        </div>
                    </div>
                </div>
                <div>
                    {
                        this.state.curList.map(item => (
                            <Card bordered={true} style={{width: 300, marginTop: 20}} hoverable={true}
                                  key={item.name}
                                  onClick={() => this.jump(item.id)}
                                  title={item.name}
                                  cover={<img alt="example" src={item.image}/>}
                                  type={'inner'}>
                                <div className="ls-title article-title">
                                    <span>
                                        {item.viewTime}次观看
                                    </span>
                                    <span>
                                         <Icon type="like" style={{fontSize: '20px', color: '#08c'}}
                                               theme={'outlined'}/>
                                               <span>
                                                   {item.rate}%
                                               </span>
                                    </span>
                                </div>
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
                                onChange={this.changePageSize}/>
                </div>
            </div>
        );
    }
}
