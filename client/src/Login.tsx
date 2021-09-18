/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable comma-dangle */
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import * as userActions from './actions/userActions';
import CodeEditor from './components/CodeEditor';
import Home from './Home';
// import ChooseUserName from './ChooseUserName';

const Login = (props: {
  dispatch: (arg0: { type: string; payload: string }) => void;
  userName: string;
  tokens: string[];
}) => {
  const chooseUserName = (userName: string) => {
    props.dispatch({ type: 'ASSIGN_USERNAME', payload: userName });

    // props.actions.assignUserName(userName);
  };
  return (
    <div>
      {/*      
      HomePage
      <br />
             Username: {props.userName}
      <br />
      Code Editor id: {props.tokens[0]}
 */}
      <Home />
      {/*         <ChooseUserName
          userName={this.props.userName}
          chooseUserName={this.chooseUserName.bind(this)}
        />
 */}
    </div>
  );
};

function mapStateToProps(state: { currentUser: string; challenges: string[] }) {
  console.log('STATE: ', state);
  return { userName: state.currentUser, tokens: state.challenges };
}

export default connect(mapStateToProps)(Login);
