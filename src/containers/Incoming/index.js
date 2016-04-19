import React, { Component } from 'react';
import StepOneMap from '../../components/StepOneMap';

export class Incoming extends Component {
  render() {
    return (
      <section>
        <div className="container">
          <div className="row">
            <h1>Incoming residents</h1>
            <div style={{textAlign: 'center'}}>
                <h1>
                    Step 1: Where do you want to work?
                </h1>
            </div>
            <div style={{marginLeft: 'auto', marginRight: 'auto',width: '85%', textAlign: 'center', height: 350}}>
                <StepOneMap />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
