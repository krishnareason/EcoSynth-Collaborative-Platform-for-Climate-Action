import React, { useState, useRef, useCallback, useEffect } from 'react';
import { storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import './SubmitReportPage.css';

export default function SubmitReportPage() {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [stream, setStream] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startDeviceCapture = () => {
        setError('');
        setMessage('');

        navigator.geolocation.getCurrentPosition(
            (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
            () => setError('Unable to retrieve location. Please enable location services.')
        );

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(streamData => setStream(streamData))
            .catch(err => {
                console.error("Error accessing camera:", err);
                setError('Could not access camera. Please grant permission.');
            });
    };

    // --- KEY FIX: Use useEffect to safely attach the stream ---
    // This code runs only after the 'stream' state has been updated and the component has re-rendered.
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]); // The dependency array [stream] ensures this effect runs when the stream is ready.

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            const video = videoRef.current;
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(imageDataUrl);
            stopCamera();
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const retakePhoto = () => {
        setCapturedImage(null);
        startDeviceCapture();
    };
    
    const dataURLtoBlob = (dataurl) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){ u8arr[n] = bstr.charCodeAt(n); }
        return new Blob([u8arr], {type:mime});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // ... (rest of the function is the same, no changes needed here)
        if (!title || !description || !capturedImage || !location) {
            return setError('Title, description, location, and a captured photo are required.');
        }
        setError('');
        setMessage('');
        setIsSubmitting(true);

        try {
            const imageBlob = dataURLtoBlob(capturedImage);
            const storageRef = ref(storage, `submissions/${Date.now()}.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, imageBlob);

            uploadTask.on('state_changed',
                (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                (uploadError) => {
                    console.error("Firebase upload error:", uploadError);
                    setError('Failed to upload image. Please try again.');
                    setIsSubmitting(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(downloadURL => {
                            const submissionData = {
                                title,
                                description,
                                imageUrl: downloadURL,
                                submittedBy: currentUser?.displayName || 'A User',
                                lat: location.lat,
                                lng: location.lng,
                            };

                            return fetch('http://localhost:8000/api/submissions', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(submissionData)
                            });
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw new Error(err.message || 'Server error'); });
                            }
                            return response.json();
                        })
                        .then(() => {
                            setMessage('Report submitted successfully! Thank you.');
                            setTitle('');
                            setDescription('');
                            setCapturedImage(null);
                            setLocation(null);
                            setIsSubmitting(false);
                        })
                        .catch(err => {
                            console.error("Submission process error:", err);
                            setError(`Submission failed: ${err.message}`);
                            setIsSubmitting(false);
                        });
                }
            );
        } catch (processError) {
            console.error("Image processing error:", processError);
            setError('Failed to process the captured image.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="submit-report-container">
            <div className="submit-report-card">
                <h2>Report an Environmental Issue</h2>
                <p>Use your camera to provide live, geolocated proof of environmental concerns.</p>
                
                {!stream && !capturedImage && (
                    <div className="start-capture">
                        <button onClick={startDeviceCapture} className="start-btn">Start Live Capture</button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {stream && !capturedImage && (
                         <div className="camera-view">
                            <video ref={videoRef} autoPlay playsInline muted></video>
                            <button type="button" onClick={capturePhoto} className="capture-btn"></button>
                         </div>
                    )}

                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                    {capturedImage && (
                        <div className="form-content">
                            <div className="image-preview">
                                <img src={capturedImage} alt="Captured report proof" />
                                <button type="button" onClick={retakePhoto} className="retake-btn">Retake</button>
                            </div>

                             <div className="form-group">
                                <label>Location</label>
                                <p className="location-data">
                                    {location ? `Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)} (Captured)` : 'No location data'}
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                            </div>

                            {isSubmitting && (
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                            )}
                            
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    )}
                    
                    {error && <p className="message error-message">{error}</p>}
                    {message && <p className="message success-message">{message}</p>}
                </form>
            </div>
        </div>
    );
}