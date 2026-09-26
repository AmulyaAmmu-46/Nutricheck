import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceCapture = ({ onDescriptor, disabled = false }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch (cameraError) {
        if (!active) return;
        if (cameraError.name === 'NotAllowedError' || cameraError.name === 'PermissionDeniedError') {
          setError('Camera permission is blocked. Click the camera icon in the browser address bar and choose Allow, then retry.');
        } else if (cameraError.name === 'NotFoundError') {
          setError('No camera was found. Connect a camera and retry.');
        } else {
          setError(`Camera could not start: ${cameraError.message || cameraError.name}`);
        }
      }
    };

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access requires localhost or HTTPS in a supported browser.');
      return undefined;
    }

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ])
      .then(() => {
        if (!active) return;
        setModelsReady(true);
        return startCamera();
      })
      .catch((modelError) => {
        if (active) setError(`Face models could not load: ${modelError.message || 'check the frontend model files'}`);
      });

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureFace = async () => {
    setError('');
    setCapturing(true);
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('No clear face detected. Look at the camera and try again.');
        return;
      }

      onDescriptor(Array.from(detection.descriptor));
    } catch (captureError) {
      setError('Unable to read a face from the camera. Try again with better lighting.');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl bg-gray-900 aspect-video">
        <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
      </div>
      <p className="text-center text-xs text-gray-600">
        {!modelsReady ? 'Loading face recognition...' : !cameraReady ? 'Waiting for camera permission...' : 'Center your face in the camera'}
      </p>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      {modelsReady && !cameraReady && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full rounded-xl border border-cyan-300 px-4 py-2 text-sm font-bold text-cyan-700 hover:bg-cyan-50"
        >
          Retry Camera Access
        </button>
      )}
      <button
        type="button"
        onClick={captureFace}
        disabled={disabled || !modelsReady || !cameraReady || capturing}
        className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {capturing ? 'Reading face...' : 'Capture Face'}
      </button>
    </div>
  );
};

export default FaceCapture;