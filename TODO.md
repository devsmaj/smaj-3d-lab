# SMAJ 3D Lab — Product Roadmap

The build stays in this order so every interaction layer is stable before the next begins.

## 1. 3D foundation
- [x] Establish branding and repository documentation
- [x] Scaffold React + TypeScript + Vite
- [x] Add Three.js, React Three Fiber, Drei, Zustand, and Tailwind CSS
- [x] Create the planned source architecture
- [x] Render a computer-component scene with lighting and a stable camera
- [x] Add mouse/touch orbit, zoom, selection, and educational information
- [ ] Replace prototype geometry with an optimized GLB/glTF motherboard
- [ ] Add model loading, error, progress, keyboard, and mobile checks

## 2. Webcam and hand landmarks
- [ ] Add a camera permission explainer and explicit enable action
- [ ] Implement CameraFeed with getUserMedia and error states
- [ ] Integrate MediaPipe and visualize all 21 landmarks
- [ ] Add confidence thresholds and coordinate smoothing

## 3. Gesture engine
- [ ] Implement Point, Pinch, Open Palm, Swipe Left, and Swipe Right
- [ ] Normalize coordinates and add cooldowns and movement thresholds
- [ ] Build a gesture diagnostics view

## 4. Gesture-to-3D control
- [ ] Connect pointing to selection and pinch to grab/release
- [ ] Add movement, rotation, and zoom
- [ ] Preserve mouse and touch fallback controls

## 5. Interactive Computer Lab
- [ ] Teach CPU, RAM, GPU, SSD, motherboard, and cooling
- [ ] Add structured lessons and an interactive knowledge check

## 6. AI tutor and accounts
- [ ] Add a contextual AI tutor after the core lab is stable
- [ ] Add accounts, saved progress, quiz results, and learning history

## 7. Quality and launch
- [ ] Optimize 3D, camera, MediaPipe, and React performance
- [ ] Test desktop, mobile, permissions, lighting, and fallback controls
- [ ] Run accessibility and production checks
- [ ] Deploy and smoke-test the MVP

## MVP definition
One polished Interactive Computer Lab with six components, reliable mouse/touch controls, hand tracking, lessons, and a context-aware AI tutor.
