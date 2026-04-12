import { useState } from 'react';


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

export default function About() {
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === quizData[currentQuestion].answer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="about-page-container">
      {/* JOURNEY SECTION */}
      <section className="about-topic">
        <div className="topic-container">
          <h2 className="heading">My <span>Web Development</span> Journey</h2>

          <div className="topic-section">
            <div className="content-with-image">
              <div className="content-text">
                <h3>What I Love About Web Development</h3>
                <p>
                Web development has captivated me since the moment I wrote my first line of HTML. There's something incredibly satisfying about building something from scratch and watching it come to life on the screen. Every project is like solving a puzzle—combining creativity with logic to create functional, beautiful websites.
                </p>
                <p>
                 What I love most is the endless opportunity for learning. Technology evolves rapidly, and there's always a new framework, tool, or technique to explore. Whether it's mastering responsive design, diving into JavaScript frameworks, or perfecting my CSS animations, each challenge pushes me to grow as a developer.
                </p>
                <p>
                The best part? Seeing users interact with something I've built. Knowing that my code can make someone's life easier or their experience more enjoyable drives me to continuously improve my craft. It's this blend of creativity, problem-solving, and real-world impact that keeps me passionate about web development.
                </p>
              </div>
              <div className="content-image">
                <img src="/images/codingLaptop.jpg" alt="Coding on laptop" />
              </div>
            </div>
          </div>

          <div className="topic-section">
            <div className="content-with-image reverse">
              <div className="content-text">
                <h3>Why I Chose This Path</h3>
                <p>
                Growing up, I was always curious about how websites worked. I'd spend hours exploring different sites, wondering what made them tick. When I discovered that I could actually build them myself, I was hooked. Computer Science felt like the perfect blend of creativity and problem-solving that I was looking for.
                </p>
                <p>
                My goal of achieving financial stability also plays a huge role. Full-stack development offers incredible career opportunities, and I'm committed to mastering both front-end and back-end technologies. I see it as my ticket to not just a job, but a fulfilling career where I can continuously challenge myself and grow professionally.
                </p>
                <p>
                Beyond the practical benefits, web development allows me to express myself creatively while building something tangible. Every project is an opportunity to bring ideas to life and make a real impact in the digital world. Whether it's creating a sleek portfolio, an interactive web app, or a helpful tool, I find joy in every line of code I write.
                </p>

              </div>
              <div className="content-image">
                <img src="/images/laptopYellowMug.jpg" alt="Modern workspace" />
              </div>
            </div>
          </div>

          <blockquote>
            "The best way to predict the future is to create it."
            <cite>— Abraham Lincoln</cite>
          </blockquote>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="timeline-section">
        <div className="topic-container">
          <h2 className="heading">My Journey in <span>Computer Science</span></h2>
          <div className="timeline-list">
            <ol>
              <li>
                <strong>First Year (2023) - The Beginning:</strong> 
                I started my Computer Science journey at DMMMSU-SLUC, where I learned the basics of C programming using CodeBlocks. We studied C syntax and program logic through flowcharts, and created simple programs, including arithmetic operations. This experience helped me build a strong foundation in logical thinking and problem-solving.
              </li>
              <li>
                <strong>Second Year (2024) - Exploring Things:</strong> 
                In the Second Year, we learned Python for Graphics and Visual Computing, where I worked on image and color transformations. I also used Python for various NLP projects and tasks. In Digital Design, my group and I successfully built an Automated Plant Watering System using IoT, Arduino, and cabling. I also created a Microsoft Access database from scratch, and although it wasn’t perfect, I received high grades, which motivated me to keep learning.
              </li>
              <li>
                <strong>Third Year (2025) - Expanding Skills:</strong> 
                In the first semester, we used Python for Intelligent Systems to train models for plant disease detection. In HCI, my team developed CosmoScope, a mobile AR app built with Dart and Flutter. CosmoScope enables users to visualize celestial objects such as planets, galaxies, and constellations through immersive AR features. The project is currently 70% complete, with functional front-end and AR components, but without backend support yet. This experience strengthened my skills in mobile development, teamwork, and real-world application building.
                Now, I am advancing my HTML, CSS, and JavaScript skills as I work toward becoming a full-stack developer.
              </li>
              <li>
                <strong>Ongoing - Continuous Learning</strong>
                Actively practicing coding challenges on platforms like freeCodeCamp and studying best practices in web development. Contributing to open-source projects when possible and staying updated with the latest web development trends, tools, and frameworks through online courses and developer communities.
                 </li>
              <li>
                <strong>Future Goals - Full-Stack Mastery:</strong> 
                Planning to master Node.js, Express, and database technologies like MongoDB and PostgreSQL to become a complete full-stack developer. Aiming to land internships and build a strong portfolio of real-world projects. Ultimate goal: work with multiple clients nationwide and eventually build my own web development agency or products.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* QUIZ SECTION */}
      <section className="quiz-body">
        <div className="quiz-container">
          {!showResult ? (
            <>
              <h2 className="quiz-h2">{quizData[currentQuestion].question}</h2>
              <div className="quiz-options">
                {quizData[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`quiz-option ${selectedOption === index ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button 
                className="quiz-button" 
                onClick={handleSubmit} 
                disabled={selectedOption === null}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <div className="quiz-result">
              <h2>Quiz Completed!</h2>
              <p>Your score: {score} / {quizData.length}</p>
              <button className="quiz-button" onClick={() => {setShowResult(false); setCurrentQuestion(0); setScore(0);}}>Restart</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}