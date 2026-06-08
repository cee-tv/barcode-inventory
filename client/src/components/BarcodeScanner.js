import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga2';
import './BarcodeScanner.css';

function BarcodeScanner({ onScan }) {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startScanner = async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      Quagga.init({
        inputStream: {
          sourceType: 'LiveStream',
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: 'environment'
          },
          target: videoRef.current
        },
        decoder: {
          workers: 2,
          debug: false,
          multiple: false
        }
      }, (err) => {
        if (err) {
          console.error('Quagga error:', err);
          alert('Error initializing barcode scanner: ' + err.message);
          stopScanner();
          return;
        }
        Quagga.start();
        Quagga.onDetected(handleDetection);
      });
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    Quagga.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const handleDetection = (data) => {
    if (data.codeResult && data.codeResult.code) {
      const barcode = data.codeResult.code;
      console.log('Barcode detected:', barcode);
      onScan(barcode);
      stopScanner();
    }
  };

  const handleManualInput = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <div className="barcode-scanner">
      <div className="scanner-controls">
        {!scanning ? (
          <button className="btn btn-primary" onClick={startScanner}>
            🎥 Start Camera Scanner
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopScanner}>
            ⏹️ Stop Scanner
          </button>
        )}
      </div>

      {scanning && (
        <div className="scanner-container">
          <video
            ref={videoRef}
            width="100%"
            height="auto"
            className="video-stream"
            autoPlay
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="canvas-overlay" />
          <div className="scanner-overlay">
            <div className="scanner-frame"></div>
            <p className="scanner-text">Point camera at barcode</p>
          </div>
        </div>
      )}

      <div className="manual-input-section">
        <h3>Manual Barcode Entry</h3>
        <form onSubmit={handleManualInput}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter barcode manually..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="barcode-input"
              autoFocus
            />
            <button type="submit" className="btn btn-primary">
              Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BarcodeScanner;
