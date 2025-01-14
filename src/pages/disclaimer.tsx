import React from 'react';
import Layout from '@theme/Layout';

const Disclaimer: React.FC = () => {
  return (
    <Layout title="Disclaimer">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Disclaimer</h1>
            <p>
              The following notes were created for personal reference and revision purposes for learning a variety of technologies.
              The notes were gathered from various sources; the majority of the content was derived from YouTube, mainly from Chai Aur Code.
              I then provided these notes to ChatGPT, who helped in the detailing, explaining, organizing, and formatting them for better clarity, readability, and understanding.
            </p>
            <p>
              <strong>Note:</strong> These notes are heavily AI-generated and contain probably plagiarized material since they are AI-generated.
              They are not intended for publishing or distribution in any formal capacity but are solely for my personal use and learning.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
