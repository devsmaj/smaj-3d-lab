# Quality checklist

Automated on every push:

- Strict TypeScript production build
- Gesture mathematics and interaction-controller unit tests
- Desktop and Pixel-sized Chromium learning-flow tests
- Critical and serious automated accessibility scan
- Horizontal-overflow and keyboard-fallback checks
- 3 MB JavaScript bundle budget
- Post-deployment HTTP smoke test

Real-device checks before a public classroom launch:

- Camera permission allow and deny flows on Chrome, Edge, Safari, and Firefox
- Bright, dim, and backlit rooms
- Left and right hands at near, normal, and far distances
- Mouse, touch, keyboard, and gesture fallbacks
- A lower-powered laptop and a current mobile phone

CI cannot reproduce physical cameras, lighting, or device thermals, so this matrix complements the automated suite.
