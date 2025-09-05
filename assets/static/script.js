// let savedUser = {}; // Store user signup info

// // Email validation function
// function isValidEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }


// document.addEventListener("DOMContentLoaded", function () {
//     // Signup Validation
//     const signinForm = document.getElementById("signinform");
//     if (signinForm) {
//         signinForm.addEventListener("submit", function (e) {
//             e.preventDefault();

//             let username = document.getElementById("username").value.trim();
//             let email = document.getElementById("email").value.trim();
//             let phone = document.getElementById("phno").value.trim();
//             let password = document.getElementById("password").value;
//             let confirmPassword = document.getElementById("confirmpassword").value;
//             let error = "";

//             if (username.length < 3) {
//                 error = "Username must be at least 3 characters.";
//             } else if (!isValidEmail(email)) {
//                 error = "Enter a valid email address.";
//             } else if (phone.length < 10 || isNaN(phone)) {
//                 error = "Enter a valid 10-digit phone number.";
//             } else if (password.length < 6) {
//                 error = "Password must be at least 6 characters.";
//             } else if (password !== confirmPassword) {
//                 error = "Passwords do not match.";
//             }

//             if (error) {
//                 document.getElementById("errorsignin").textContent = error;
//             } else {
//                 document.getElementById("errorsignin").textContent = "";
//                 // alert("Sign Up Successful");
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Signup Successful!',
//                     text: 'You can now log in with your credentials'
//                 })

//                 savedUser = { username, email, password, phone };
//                 localStorage.setItem("savedUser", JSON.stringify(savedUser));
//                 document.getElementById("signinform").reset();

//                 // Optionally redirect to login page
//                 setTimeout(() => {
//                     window.location.href = "{% url 'login' %}";
//                 }, 2000);
//             }
//         });
//     }

//     // Login Validation
//     const loginForm = document.getElementById("loginForm");
//     if (loginForm) {
//         // Load saved user data from localStorage
//         const storedUser = localStorage.getItem("savedUser");
//         if (storedUser) {
//             savedUser = JSON.parse(storedUser);
//         }

//         loginForm.addEventListener("submit", function (e) {
//             e.preventDefault(); // stop page refresh

//             let email = document.getElementById("loginEmail").value.trim();
//             let password = document.getElementById("loginPassword").value;
//             let error = "";

//             if (!isValidEmail(email)) {
//                 error = "Enter a valid email address.";
//             } else if (password.length < 6) {
//                 error = "Password must be at least 6 characters.";
//             } else if (!savedUser.email || email !== savedUser.email || password !== savedUser.password) {
//                 error = "Invalid email or password. Please sign up first if you don't have an account.";
//                 swal.fire({
//                     icon: 'error',
//                     title: 'Oops...',
//                     text: 'Invalid Password or email!'
//                 });
//             }

//             if (error) {
//                 document.getElementById("error").textContent = error;
//             } else {
//                 document.getElementById("error").textContent = "";
//                 // alert("Login Successful Redirecting...");
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Login Successful!',
//                 })
//                 setTimeout(() => {
//                     const dashboardUrl = document.getElementById("loginBtn").dataset.dashboardUrl;
//                     window.location.href = dashboardUrl;
//                 }, 2000);
//             }
//         });
//     }
// });