import React, { Component } from 'react';
import StepOneMap from '../../components/StepOneMap';

export class Incoming extends Component {
  render() {
    return (
      <section>
        <div className="container">
          <div className="row">
            <div style={{marginLeft: 'auto', marginRight: 'auto',width: '85%', textAlign: 'center'}}>
                <StepOneMap />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
