import React, {Component} from 'react';
import {Card, Icon, Pagination, Tag} from 'antd';
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
            allTags: [],
        }
        // this.localIndex = this.props.match.params.pageIndex;
    }

    componentDidMount() {
        // this.localIndex = this.props.match.params.pageIndex;
        // console.log("this.localIndex =" + this.localIndex);
        this.getUrl(this.state.current, this.state.orderType, this.state.orderField, null);
        // this.getUrl(this.localIndex);
        // this.jump(this.localIndex);
        this.getAllTags();
        this.timerId = setInterval(() => this.heartBeat(), 5000);
    }


    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    getAllTags = () => {
        axios.get(api + '/video/all/tags', {}).then((res) => {
            console.log("所有tag:", res.data.data)
            this.setState({
                allTags: res.data.data
            });
        }).catch(function (error) {
            console.log(error);
        });
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
        this.getUrl(this.state.current, orderType, orderField, null);
    };

    changePageSize = (pageNumber) => {
        this.getUrl(pageNumber, this.state.orderType, this.state.orderField, null);
    }

    getUrl = (pageNumber, orderType, orderField, tagId) => {
        this.setState({
            current: pageNumber
        });
        axios.get(api + '/video/list/page', {
            params: {
                pageIndex: pageNumber,
                pageSize: 20,
                orderType: orderType,
                tagId: tagId,
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
                        <span className="sortText">创建时间</span>
                        <div className="sortFont">
                            <span onClick={() => this.changeSortField('createTime', 'ASC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-up-filling"></use>
                                </svg>
                            </span>
                            <span onClick={() => this.changeSortField('createTime', 'DESC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-down-filling"></use>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="sortField">
                        <span className="sortText">好评</span>
                        <div className="sortFont">
                            <span onClick={() => this.changeSortField('up', 'ASC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-up-filling"></use>
                                </svg>
                            </span>
                            <span onClick={() => this.changeSortField('up', 'DESC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-down-filling"></use>
                                </svg>
                            </span>

                        </div>
                    </div>
                    <div className="sortField">
                        <span className="sortText">播放次数</span>
                        <div className="sortFont">
                            <span onClick={() => this.changeSortField('viewTime', 'ASC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-up-filling"></use>
                                </svg>
                            </span>
                            <span onClick={() => this.changeSortField('viewTime', 'DESC')}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-arrow-down-filling"></use>
                                </svg>
                            </span>

                        </div>
                    </div>

                </div>
                <div className="search-tags">
                    {
                        this.state.allTags.map(item => (
                            <Tag color="orange"
                                 onClick={()=>this.getUrl(this.state.current, this.state.orderType, this.state.orderField, item.id)}>{item.name}</Tag>
                        ))
                    }
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
