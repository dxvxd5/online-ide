import React, { useState, useEffect, useRef } from 'react';
import { Codemirror } from 'react-codemirror-ts';
import './App.css';
import io from 'socket.io-client';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';

function App(): JSX.Element {
  const [value, setValue] = useState<string>('');
  const socketClient = useRef<SocketIOClient.Socket>();

  useEffect(() => {
    socketClient.current = io.connect('http://localhost:5000');

    if (socketClient.current) {
      //
    }
  });
  return (
    <div className="app">
      <Codemirror
        value=""
        name="example"
        options={{
          lineNumbers: true,
          lineWrapping: true,
          matchBrackets: true,
          mode: 'javascript',
          tabSize: 2,
        }}
        onChange={(value2, options) => {
          setValue(value2);
        }}
      />{' '}
    </div>
  );
}

export default App;
