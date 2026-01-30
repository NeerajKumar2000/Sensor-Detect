import React from 'react';

export default function LiveFeed() {
  return (
    <div className="h-screen p-0 m-0 overflow-hidden">
      <iframe
        src="https://alertwest.live/"
        title="AlertWest Camera Feed"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
