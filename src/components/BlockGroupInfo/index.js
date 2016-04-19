import React, { Component } from 'react';
import { Link } from 'react-router';

export class BlockGroupInfo extends Component {
  render() {
    return (
      <section>
        <h3>Block group info</h3>
        {this.props.blockGroup ? this.renderBlockGroup() : this.renderNothing()}
      </section>
    );
  }

  renderBlockGroup() {
    return (
      <ul>
        <li>ID: {this.props.blockGroup.TARGET_FID}</li>
        <li>Total population: {this.props.blockGroup.TOT_POP}</li>
        <li>County: {this.props.blockGroup.COUNTY}</li>
        <li>Municipality: {this.props.blockGroup.TOWN}</li>
        <li>Median age: {this.props.blockGroup.MED_AGE}</li>
        <li>Median income: {this.props.blockGroup.MED_INC}</li>
        <li>Seniors: {this.props.blockGroup.SENIOR}</li>
        <li>Zero vehicle households: {this.props.blockGroup.ZERO_VEH}</li>
        <li>Total households: {this.props.blockGroup.TOT_HSHD}</li>
      </ul>
    )
  }

  renderNothing() {
    return (
      <p>Nothing yet.</p>
    );
  }
}
