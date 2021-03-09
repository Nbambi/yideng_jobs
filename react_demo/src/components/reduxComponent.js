import React from 'react';
import { Provider } from 'react-redux';
import ReduxCounter from './reduxCounter';
// import store from '../store/store'; //一个未拆分 reducer 的 store
import combineStore from '../store/combineStore';  //拆分 reducer 的 store

class ReduxComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    add = () => {
        this.setState({ count: this.state.count + 1 });
    }

    reduce = () => {
        this.setState({ count: this.state.count - 1 });
    }

    render() {
        return (
            <div>
                {/* 下面这部分是 react 传统的用 state 实现的计数器 */}
                <h3 className="App-link">我是counter组件</h3>
                <div>
                    <button className="redux_button" onClick={this.add}> 加 </button>
                    <span className="App-link">{this.state.count}</span>
                    <button className="redux_button" onClick={this.reduce}> 减 </button>
                </div>

                {/* 下面是使用 redux 与 react 结合实现的计数器及异步请求的组件 */}
                {/* <Provider store={store}>
                    <ReduxCounter />
                </Provider> */}
                <Provider store={combineStore}>
                    <ReduxCounter />
                </Provider>
            </div>
        )
    }

}

export default ReduxComponent;