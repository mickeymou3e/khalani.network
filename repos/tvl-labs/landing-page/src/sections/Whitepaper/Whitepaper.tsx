import React from 'react'

function Whitepaper() {
  return (
    <div
      style={{
        width: '90%',
        maxWidth: '900px',
        height: '100%',
        margin: '20px auto',
        border: '1px solid #ccc',
        overflow: 'auto',
        background: '#000',
      }}
    >
      <iframe
        src="https://drive.google.com/file/d/17c3xqFJKC9CHMUHKC7F_GGHnIcd75gj7/preview"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default Whitepaper
