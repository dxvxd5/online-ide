/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable comma-dangle */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import testingActions from '../../redux/actions/testingActions';
import userActions from '../../redux/actions/userActions';
import Home from '../home/Home';
// import ChooseUserName from './ChooseUserName';

const Login = (props: {
  actions: { getData: (arg0: string) => void };
  /*   backend: {
    getDataFromBackend: any;
  };
 */
}) => {
  const [response, setResponse] = useState([]);

  const chooseUserName = () => {
    // "props.dispatch" is used when we don't declare "mapDispatchToProps" function in our component:
    // props.dispatch({ type: 'ASSIGN_USERNAME', payload: userName });

    // "props.actions" is used when we declare "mapDispatchToProps" function in our component:
    // props.actions.assignUserName('Sara');
    props.actions.getData('https://jsonplaceholder.typicode.com/users');

    // console.log('backend.getDataFromBackend: ', props.getDataFromBackend);
  };
  return (
    <div>
      <button type="submit" onClick={chooseUserName}>
        GET REQUEST
      </button>
      {response.map((person: any) => (
        <div key={person.id}>{person.name}</div>
      ))}
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

function mapStateToProps(state: {
  currentUser: string;
  challenges: string[];
  backend: any;
}) {
  console.log('STATE: ', state);
  const { currentUser, challenges, backend } = state;

  return {
    currentUser,
    challenges,
    backend,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators(
      { ...testingActions, ...userActions },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
