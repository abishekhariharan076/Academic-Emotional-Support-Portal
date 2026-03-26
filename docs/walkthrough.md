# Walkthrough - Media Support for Check-In

I have added support for photos and videos in the emotional check-in feature, allowing students to share visual context with their counselors.

## Changes Made

### Backend

- **Multer Integration**: Added `multer` for handling multipart/form-data.
- **Upload Middleware**: Created `backend/middleware/upload.middleware.js` to manage file storage and validation for images and videos.
- **Model Update**: Updated the `CheckIn` model to store an array of media attachments.
- **Static Files**: Configured `server.js` to serve uploaded files from the `uploads/checkins` directory.
- **Controller Logic**: Updated `checkin.controller.js` to process uploaded files and save their metadata.

### Frontend

- **Media Selection UI**: Added a sleek, dashed-border upload area in `CheckIn.jsx`.
- **File Management**: Students can select up to 5 files, preview their names/types, and remove them before submission.
- **FormData Submission**: Updated the submission logic to use `FormData` for reliable multi-file uploads.
- **Media Display**: 
    - Updated `CheckInHistory.jsx` (Student) to show a grid of uploaded photos and videos.
    - Updated `CounselorDashboard.jsx` (Counselor) to allow counselors to view the visual context provided by students.

## How to Test

1. Navigate to the **Check-In** page.
2. Select your mood and factors.
3. Use the new **Photos or Videos** section to upload media.
4. Submit the check-in.
5. Visit your **Check-In History** to see your uploaded media.
6. (If logged in as a counselor) Check the **Counselor Dashboard** to view the student's media.
