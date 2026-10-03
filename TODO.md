# SMAJ 3D Lab - Product Roadmap

The build stays in this order so every interaction layer is stable before the next begins.

## 1. 3D foundation
- [x] Establish branding and repository documentation
- [x] Scaffold React + TypeScript + Vite
- [x] Add Three.js, React Three Fiber, Drei, Zustand, and Tailwind CSS
- [x] Create the planned source architecture
- [x] Render a computer-component scene with lighting and a stable camera
- [x] Add mouse/touch orbit, zoom, selection, and educational information
- [x] Replace prototype geometry with an optimized GLB/glTF motherboard
- [x] Add model loading, error, progress, keyboard, and mobile checks

## 2. Webcam and hand landmarks
- [x] Add a camera permission explainer and explicit enable action
- [x] Implement CameraFeed with getUserMedia and error states
- [x] Integrate MediaPipe and visualize all 21 landmarks
- [x] Add confidence thresholds and coordinate smoothing

## 3. Gesture engine
- [x] Implement Point, Pinch, Open Palm, Swipe Left, and Swipe Right
- [x] Normalize coordinates and add cooldowns and movement thresholds
- [x] Build a gesture diagnostics view

## 4. Gesture-to-3D control
- [x] Connect pointing to selection and pinch to grab/release
- [x] Add movement, rotation, and zoom
- [x] Preserve mouse and touch fallback controls

## 5. Interactive Computer Lab
- [x] Teach CPU, RAM, GPU, SSD, motherboard, and cooling
- [x] Add structured lessons and an interactive knowledge check

## 6. AI tutor and accounts
- [x] Add a contextual tutor with guided fallback and a protected AI function
- [x] Add guest accounts, local progress, quiz history, Supabase auth, and cloud sync
- [ ] Connect the production Supabase project and server-side OpenAI secret

## 7. Quality and launch
- [x] Optimize 3D, camera, MediaPipe, and React performance
- [x] Add automated desktop/mobile/fallback tests and a real-device camera matrix
- [x] Run accessibility, unit, bundle-budget, and production checks
- [x] Deploy and smoke-test the MVP

## MVP definition
One polished Interactive Computer Lab with six components, reliable mouse/touch controls, hand tracking, lessons, and a context-aware AI tutor.
