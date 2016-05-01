import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export class D3Chart extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.initialize(this._svg);
    this.update(this._svg);
  }

  componentDidUpdate() {
    this.update(this._svg);
  }

  initialize() {}
  update() {}

  render() {
    return (
      <svg
        className={this.className}
        height={this.props.height}
        width={this.props.width}
        ref={(svg) => this._svg = svg} />
    )
  }
}
