/**
 * react 与 redux 结合
 *  使用了 react-redux
 */

import React from 'react';
import { connect } from 'react-redux';
import { add, reduce } from '../actions/countAction';
import { fetchData } from '../actions/dataAction';

/**
 * 建立 [组件props & store的state] 的映射
 * 
 * @param {*} state redux.store.state
 * @returns ReactComponent.props
 */
function mapStateToProps(state) {
    // 格式：ReactComponent.props.count: store.state.count
    console.log('组件接收到的store state:', state);
    return {
        // 这个是未拆分reducer的store
        // count: state.count,
        // loading: state.loading,
        // data: state.data,
        // error: state.error

        // 拆分后要分别去拿对应的 reducer,多了一层
        count: state.countReducer.count,
        loading: state.dataReducer.loading,
        data: state.dataReducer.data,
        error: state.dataReducer.error
    }
}

/**
 * 建立 [组件props & store.dispatch方法] 的映射，可以是一个函数，也可以是一个对象
 */
// 1. 对象写法
// const mapDispatchToProps = {
//     add,
//     reduce,
//     fetchData
// }
// 2. 函数写法
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        add: () => dispatch(add()),
        reduce: () => dispatch(reduce()),
        fetchData: () => dispatch(fetchData())
    }
}

class ReduxCounter extends React.Component {
    componentDidMount() {
        this.props.fetchData();
        // // this.props.fetchData().then(res => {
        // //     console.log('fetchData:', res);
        // // });
    }

    handleAdd = () => {
        // 1. 没有 mapDispatchToProps 映射时候：
        // this.props.dispatch(add()); //dispatch方法随着connect一同被返回到props里，所以可以直接取到这个方法进行action派发

        // 2. 建立 mapDispatchToProps 映射后：
        this.props.add();
    }

    handleReduce = () => {
        // this.props.dispatch(reduce());
        this.props.reduce();
    }

    render() {
        const { count, error, data, loading } = this.props;
        if (loading) {
            return (<h3 className="App-link">异步请求数据正在加载中...</h3>)
        }
        return (
            <div>
                { error && <h3 className="App-link">异步请求数据fetch失败...<span>{error}</span></h3>}
                {
                    data &&
                    <ul>
                        {Object.entries(data).map((item, index) => {
                            return (<li key={index}><span>{item[0]}</span>--<span>{item[1]}</span></li>);
                        })}
                    </ul>
                }

                <h3 className="App-link">我是Redux counter组件</h3>
                <div>
                    <button className="redux_button" onClick={this.handleAdd}> 加 </button>
                    <span className="App-link">{count}</span>
                    <button className="redux_button" onClick={this.handleReduce}> 减 </button>
                </div>
            </div>
        )
    }
}

// 组件会订阅 mapStateToProps，每次状态发生变化后都会通知这个函数，这个函数名是自定义的，但是这个名字一般约定俗成就叫这个
// connect 高阶函数
export default connect(mapStateToProps, mapDispatchToProps)(ReduxCounter);