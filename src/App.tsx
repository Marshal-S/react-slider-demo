import React from 'react';
import { LightSlider } from './lightSlider';

function App() {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <LightSlider 
        min={0}
        max={10}
        style={{marginLeft: 100, marginTop: 100}}
        changed={(e) => {
          console.log('changed', e)
        }} 
        completed={(e) => {
          console.log('completed', e)
        }}
      />
    </div>
  );
}

export default App;
