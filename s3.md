Here’s the shortest way to use your GCS media from the frontend.

- Display public media (no keys needed)
  - Image: <img src="https://storage.googleapis.com/dukenapp-user-images/path/to/file.jpg">
  - Video: <video src="https://storage.googleapis.com/dukenapp-user-images/path/to/file.mp4" controls>

- Upload from browser (no keys in frontend; use signed URLs)
  1) Frontend asks your backend for a signed URL:
          const file = input.files[0];
     const r = await fetch(`/v1/storage/signed-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
     const { url, method, headers, publicUrl } = await r.json();
     await fetch(url, { method, headers, body: file }); // upload
     // Then display:
     img.src = publicUrl; // or video.src = publicUrl
     
  2) Backend generates the signed URL using the Cloud Run service account (no secrets in frontend).

- If you keep the bucket private (recommended)
  - Remove public read and always use signed GET URLs returned by your backend.
  - Frontend still uses the signed URL directly in <img>/<video>; no keys needed.

- If you use fetch/XHR to GCS, set bucket CORS to allow your web origin.