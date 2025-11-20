import app from "./app.js";

// Start Server (only when running this file directly)
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
