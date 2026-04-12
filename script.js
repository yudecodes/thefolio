//Light Mode
let lightmode = localStorage.getItem('lightmode')
const switchTheme = document.getElementById('switch-theme')

const enableLightMode = () => {
    document.body.classList.add('lightmode')
    localStorage.setItem('lightmode', 'active')
}

const disableLightMode = () => {
    document.body.classList.remove('lightmode')
    localStorage.setItem('lightmode', 'null')
}

if(lightmode === "active") enableLightMode()

switchTheme.addEventListener("click", () => {
    lightmode = localStorage.getItem('lightmode')
    if(lightmode !== "active")
    {
        enableLightMode()
    }
    else
    {
        disableLightMode()
    }
})

//QUIZ MODE
const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "CSS", "JavaScript", "PHP"],
    answer: 1
  },
  {
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "Java", "HTML", "C++"],
    answer: 2
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style System",
      "Cascading Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: 2
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["<!-- -->", "//", "#", "**"],
    answer: 1
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Microsoft", "Apple", "Netscape", "Google"],
    answer: 2
  },
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: ["variable x;", "var x;", "int x;", "x := 5;"],
    answer: 1
  },
  {
    question: "Which HTML tag is used to link a JavaScript file?",
    options: ["<js>", "<javascript>", "<script>", "<link>"],
    answer: 2
  },
  {
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Digital Ordinance Model",
      "Document Oriented Method"
    ],
    answer: 0
  },
  {
    question: "Which method is used to display text in the browser console?",
    options: [
      "console.print()",
      "console.write()",
      "console.log()",
      "print.console()"
    ],
    answer: 2
  }
];


  let currentQuestionIndex = 0;
  let selectedOptionIndex = null;
  let score = 0;

  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const submitBtn = document.getElementById('submitBtn');
  const resultEl = document.getElementById('result');

  function loadQuestion() {
    selectedOptionIndex = null;
    submitBtn.disabled = true;
    resultEl.textContent = '';
    const currentData = quizData[currentQuestionIndex];
    questionEl.textContent = currentData.question;
    optionsEl.innerHTML = '';
    currentData.options.forEach((option, index) => {
      const div = document.createElement('div');
      div.className = 'quiz-option';
      div.textContent = option;
      div.addEventListener('click', () => selectOption(index, div));
      optionsEl.appendChild(div);
    });
  }

  function selectOption(index, element) {
    selectedOptionIndex = index;
    submitBtn.disabled = false;
    // Remove 'selected' class from all options
    [...optionsEl.children].forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
  }

  submitBtn.addEventListener('click', () => {
    if (selectedOptionIndex === null) return;
    const currentData = quizData[currentQuestionIndex];
    if (selectedOptionIndex === currentData.answer) {
      score++;
      resultEl.style.fontSize = '15px';
      resultEl.style.color = 'green';
      resultEl.textContent = 'Correct!';
    } else {
      resultEl.style.fontSize = '15px';
      resultEl.style.color = 'red';
      resultEl.textContent = `Wrong!\nCorrect answer: ${currentData.options[currentData.answer]}`;
    }
    submitBtn.disabled = true;

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        loadQuestion();
      } else {
        showFinalScore();
      }
    }, 1500);
  });

  function showFinalScore() {
    questionEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = '';
    submitBtn.style.display = 'none';
    resultEl.style.color = '';
    resultEl.textContent = `Your final score is ${score} out of ${quizData.length}.`;
  }

  loadQuestion();

//Validatation
// Contact Form Validation
function validateContactForm() {
            let contactfullname = document.getElementById("contactfullname").value.trim();
            let contactemail = document.getElementById("contactemail").value.trim();
            let contactmessage = document.getElementById("contactmessage").value.trim();

            let contactfullnameError = document.getElementById("contactfullnameError");
            let contactemailError = document.getElementById("contactemailError");
            let contactmessageError = document.getElementById("contactmessageError");

              // Reset error messages
            contactfullnameError.textContent = "";
            contactemailError.textContent = "";
            contactmessageError.textContent = "";

            let isContactValid = true;

              // Name validation
            if (contactfullname === "") {
              contactfullnameError.textContent = "Full name is required";
              isContactValid = false;
            } else if (contactfullname.length < 3) {
              contactfullnameError.textContent = "Full name must be at least 3 characters";
              isContactValid = false;
            }

              // Email validation
            if (contactemail === "") {
              contactemailError.textContent = "Email is required";
              isContactValid = false;
            } else if (!isValidEmail(contactemail)) {
              contactemailError.textContent = "Invalid email format (example: user@email.com)";
              isContactValid = false;
            }

              // Message validation
            if (contactmessage === "") {
              contactmessageError.textContent = "Message is required";
              isContactValid = false;
            } else if (contactmessage.length < 5) {
              contactmessageError.textContent = "Message must be at least 10 characters";
              isContactValid = false;
            }

            if (isContactValid) {
              // Send message to backend
              fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: contactfullname,
                  email: contactemail,
                  message: contactmessage,
                }),
              })
              .then(response => response.json())
              .then(data => {
                if (data.message === 'Message sent successfully') {
                  alert("Message sent successfully! Thank you for contacting us, " + contactfullname + "!");
                  // Clear the form
                  document.getElementById("contactfullname").value = '';
                  document.getElementById("contactemail").value = '';
                  document.getElementById("contactmessage").value = '';
                } else {
                  alert("Failed to send message: " + data.message);
                }
              })
              .catch(error => {
                console.error('Error:', error);
                alert("Failed to send message. Please try again.");
              });
              return false;
            }

              return false; 
            }

function validateForm() {
            let fullname = document.getElementById("fullname").value.trim();
            let username = document.getElementById("username").value.trim();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            let gender = document.querySelector('input[name="gender"]:checked');
            let dob = document.getElementById("dob").value;
            let interest = document.querySelector('input[name="interest"]:checked');
            let terms = document.getElementById("terms").checked;

            let nameError = document.getElementById("nameError");
            let emailError = document.getElementById("emailError");
            let passwordError = document.getElementById("passwordError");
            let confirmPasswordError = document.getElementById("confirmPasswordError");
            let genderError = document.getElementById("genderError");
            let usernameError = document.getElementById("usernameError");
            

            // Reset error messages
            nameError.textContent = "";
            emailError.textContent = "";
            passwordError.textContent = "";
            confirmPasswordError.textContent = "";
            genderError.textContent = "";
            usernameError.textContent="";

            let isValid = true;
        
            // Name validation
            if (fullname === "") {
                nameError.textContent = "Full name is required";
                isValid = false;
            } else if (fullname.length < 3) {
                nameError.textContent = "Full name must be at least 3 characters";
                isValid = false;
            }
            //Username validation
            if (username === "") {
                usernameError.textContent = "Username is required";
                isValid = false;
            } else if (username.length < 2) {
                usernameError.textContent = "Username must be at least 2 characters";
                isValid = false;
            }

            // Email validation
             if (email === "") {
                emailError.textContent = "Email is required";
                isValid = false;
            } else if (!isValidEmail(email)) {
                emailError.textContent = "Invalid email format (example: user@email.com)";
                isValid = false;
            }
            
            // Password validation
            if (password === "") {
                passwordError.textContent = "Password is required";
                isValid = false;
            } else if (password.length < 5) {
                passwordError.textContent = "Password must be at least 5 characters";
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                passwordError.textContent = "Password must contain uppercase, lowercase, and number";
                isValid = false;
            }

            // Confirm Password validation
            if (confirmPassword === "") {
                confirmPasswordError.textContent = "Please confirm your password";
                isValid = false;
            } else if (password !== confirmPassword) {
                confirmPasswordError.textContent = "Passwords do not match";
                isValid = false;
            }

            // Gender validation
            if (!gender) {
                genderError.textContent = "Please select your gender";
                isValid = false;
            }
            //Date Validation
            if (!dob) {
                let dobError = document.querySelector("#dob + .error");
                if (!dobError) {
                    dobError = document.createElement("span");
                    dobError.className = "error";
                    document.getElementById("dob").parentNode.appendChild(dobError);
                }
                dobError.textContent = "Date of birth is required";
                isValid = false;
            } else if (!isValidAge(dob)) {
                let dobError = document.querySelector("#dob + .error");
                if (!dobError) {
                    dobError = document.createElement("span");
                    dobError.className = "error";
                    document.getElementById("dob").parentNode.appendChild(dobError);
                }
                dobError.textContent = "You must be at least 18 years old";
                isValid = false;
            } else {
                let dobError = document.querySelector("#dob + .error");
                if (dobError) {
                    dobError.textContent = "";
                }
            }
            // ===== EXPERIENCE LEVEL VALIDATION =====
            if (!interest) {
                let interestError = document.querySelector(".radio-group + .error");
                if (!interestError) {
                    interestError = document.createElement("span");
                    interestError.className = "error";
                    document.querySelector(".radio-group").parentNode.appendChild(interestError);
                }
                interestError.textContent = "Please select your experience level";
                isValid = false;
              }

            // ===== TERMS VALIDATION =====
            if (!terms) {
                let termsError = document.getElementById("termsError");
                termsError.textContent = "You must agree to the terms";
                isValid = false;
            } else {
                let termsError = document.getElementById("termsError");
                termsError.textContent = "";
            }

            if (isValid) {
                alert("Registration successful! Welcome to the community, " + fullname + "!");
                return false; 
            }

            return false; 
        }

       function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
     function isValidAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        
        return age >= 18;
    }
