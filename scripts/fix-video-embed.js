// Run this to enable embedding for existing video
fetch('http://localhost:3000/api/upload/youtube', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ videoId: 'srRUItwg358' })
})
.then(res => res.json())
.then(data => console.log('✅ Video updated:', data))
.catch(err => console.error('❌ Error:', err));
