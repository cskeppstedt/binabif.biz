// Initialize Supabase client
const { createClient } = supabase;

// Check if config is loaded
if (typeof SUPABASE_CONFIG === "undefined") {
  console.error(
    "Config not loaded. Please create config.js from config.example.js"
  );
  document.getElementById("message").textContent =
    "Configuration error. Please check setup.";
  document.getElementById("message").className = "message error";
}

const supabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// DOM elements
const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email-input");
const submitBtn = document.getElementById("submit-btn");
const messageDiv = document.getElementById("message");
const countElement = document.getElementById("waitlist-count");

// Load waitlist count on page load
async function loadCount() {
  try {
    const { data, error } = await supabaseClient.rpc("get_waitlist_count");

    if (error) throw error;

    countElement.textContent = data || 0;
    animateCount(data || 0);
  } catch (error) {
    console.error("Error loading count:", error);
    countElement.textContent = "?";
  }
}

// Animate count number
function animateCount(finalCount) {
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentCount = Math.floor(progress * finalCount);
    countElement.textContent = currentCount;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      countElement.textContent = finalCount;
    }
  }

  requestAnimationFrame(update);
}

// Show message to user
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;

  // Clear message after 5 seconds
  setTimeout(() => {
    messageDiv.textContent = "";
    messageDiv.className = "message";
  }, 5000);
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  if (!email) {
    showMessage("Please enter your email", "error");
    return;
  }

  // Disable form while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = "Joining...";

  try {
    // Call the Supabase function to add email
    const { data, error } = await supabaseClient.rpc("add_to_waitlist", {
      user_email: email,
      url_path: window.location.pathname,
    });

    if (error) throw error;

    // Check the response from our function
    if (data.success) {
      showMessage("Welcome! You are on the waitlist.", "success");
      emailInput.value = "";

      // Reload count after successful signup
      setTimeout(() => {
        loadCount();
      }, 500);
    } else {
      showMessage(data.error || "Failed to join waitlist", "error");
    }
  } catch (error) {
    console.error("Error:", error);

    // Check for specific error types
    if (error.message.includes("unique")) {
      showMessage("This email is already registered", "error");
    } else {
      showMessage("An error occurred. Please try again.", "error");
    }
  } finally {
    // Re-enable form
    submitBtn.disabled = false;
    submitBtn.textContent = "Join the Waitlist";
  }
});

// Load count when page loads
loadCount();
