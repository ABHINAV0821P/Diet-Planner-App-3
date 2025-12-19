// IMPORTANT: Replace with your computer's local IP address.
// 1. Find your computer's IP address on your local network.
//    - On Windows, open Command Prompt and type `ipconfig`. Look for the "IPv4 Address".
//    - On macOS, open System Settings > Wi-Fi, click "Details...", and find the IP address.
// 2. Ensure your mobile device (or emulator) and computer are on the SAME Wi-Fi network.
// 3. Replace the IP address below with the one you found.

const IP_ADDRESS = "10.227.182.99"; // <-- REPLACE THIS
const API_PORT = 5001;

const API_BASE_URL = `http://${IP_ADDRESS}:${API_PORT}/api`;

export default API_BASE_URL;