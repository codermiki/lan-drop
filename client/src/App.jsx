import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DropZone from "./components/DropZone";
import UploadStatus from "./components/UploadStatus";
import { uploadFile } from "./services/uploadService";

function App() {
   const [filesState, setFilesState] = useState([]);
   const [isUploading, setIsUploading] = useState(false);
   const [serverError, setServerError] = useState(false);
   const abortControllerRef = useRef(null);

   useEffect(() => {
      const handleBeforeUnload = (e) => {
         if (isUploading) {
            e.preventDefault();
            e.returnValue = "Files are currently uploading. Are you sure you want to leave?";
         }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload);
      };
   }, [isUploading]);

   const handleFilesSelected = (newFiles) => {
      setServerError(false);
      const mappedFiles = newFiles.map((file) => ({
         id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2), // unique ID to prevent React warnings
         file,
         progress: 0,
         status: "pending", // pending, uploading, success, error
         error: null,
      }));

      setFilesState((prev) => [...prev, ...mappedFiles]);
   };

   useEffect(() => {
      // Process the queue when pending files exist and we are not currently uploading another file
      // To support sequential uploads
      const pendings = filesState.filter((f) => f.status === "pending");
      if (pendings.length > 0 && !isUploading) {
         processNextUpload(pendings[0]);
      }
   }, [filesState, isUploading]);

   const processNextUpload = async (fileObj) => {
      setIsUploading(true);
      abortControllerRef.current = new AbortController();

      updateFileState(fileObj.id, { status: "uploading" });

      try {
         await uploadFile(fileObj.file, (progress) => {
            updateFileState(fileObj.id, { progress });
         }, { signal: abortControllerRef.current.signal });
         updateFileState(fileObj.id, { status: "success", progress: 100 });
      } catch (err) {
         if (axios.isCancel(err)) {
            updateFileState(fileObj.id, { status: "error", error: "Upload cancelled." });
         } else {
            let errMessage = "Upload failed.";
            if (err.message === "Network Error") {
               errMessage = "Server unavailable. Check if backend is running.";
               setServerError(true);
            }
            updateFileState(fileObj.id, { status: "error", error: errMessage });
         }
      } finally {
         setIsUploading(false);
         abortControllerRef.current = null;
      }
   };

   const cancelUpload = (id) => {
      const fileToCancel = filesState.find((f) => f.id === id);
      if (!fileToCancel) return;

      if (fileToCancel.status === "uploading" && abortControllerRef.current) {
         abortControllerRef.current.abort();
      } else if (fileToCancel.status === "pending") {
         updateFileState(id, { status: "error", error: "Upload cancelled." });
      }
   };

   const updateFileState = (id, updates) => {
      setFilesState((prev) =>
         prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      );
   };

   return (
      <div className="app-container">
         <header className="app-header">
            <h1>LAN File Receiver</h1>
            <p>Transfer files easily across your local network</p>
         </header>

         <main className="app-main">
            {serverError && (
               <div className="server-error-banner">
                  Unable to connect to the receiver PC. Please ensure the
                  Node.js server is running on port 3000.
               </div>
            )}

            <DropZone onFilesSelected={handleFilesSelected} />

            <UploadStatus files={filesState} onCancel={cancelUpload} />
         </main>
      </div>
   );
}

export default App;
