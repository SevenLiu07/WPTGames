/**
 * Created by shiwz on 17-5-23.
 */


import React from 'react';
import ReactDOM from 'react-dom';


class Child2 extends React.Component {
    constructor(props) {
    super(props);
}
    uuu(event){
    console.log(event)
}
    render(){
      return (
           <div onClick={this.uuu}>
           请输入邮箱：<input onChange={this.props.handleEmail}/>
           </div>
        )
    }
};

//父组件，此处通过event.target.value获取子组件的值
export default class Parent2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
    }
    getInitialState(){
        return {
            email: ''
        }
    }
    handleEmail(event){
        this.setState({email: event.target.value});
    }
    render(){
        return (
            <div>
                <div>用户2222222222邮箱：{this.state.email}</div>
                <Child2 name="email" handleEmail={this.handleEmail.bind(this)}/>
            </div>
            )
    }
};

