import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';

/* components */
import { TopImage } from 'components/TopImage';

const metaData = {
  title: 'Urban Miser',
  description: 'Visualizing your new city',
  canonical: 'https://brandonmp.github.io/urban-misery',
  meta: {
    charset: 'utf-8',
    name: {
      keywords: 'react,meta,document,html,tags',
    },
  },
};

export class Home extends Component {
  render() {
    return (
      <section>
        <DocumentMeta {...metaData} />
        <TopImage />
      </section>
    );
  }
}
