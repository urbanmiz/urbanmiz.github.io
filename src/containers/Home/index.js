import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';
import StepOneMap from '../../components/StepOneMap';
/* components */
import { TopImage } from 'components/TopImage';

const metaData = {
    title: 'Urban Misery',
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
            <div>
                <section>
                    <DocumentMeta {...metaData} />
                    <TopImage />
                </section>
                <section>
                    <div style={{textAlign: 'center'}}>
                        <h1>
                            Step 1: Where do you want to work?
                        </h1>
                    </div>
                    <div style={{marginLeft: 'auto', marginRight: 'auto',width: '85%', textAlign: 'center', height: 350}}>
                        <StepOneMap />
                    </div>
                </section>
            </div>
        );
    }
}
