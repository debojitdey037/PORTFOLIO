import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in CSE (AI & ML)</h4>
                <h5>Hi-Tech Institute of Engineering & Technology</h5>
              </div>
              <h3>2025–29</h3>
            </div>
            <p>
              Pursuing a Bachelor of Technology in Computer Science and Engineering with specialization in Artificial Intelligence and Machine Learning. Building strong foundations in Data Structures, Algorithms, Object-Oriented Programming, and Software Development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer</h4>
                <h5>Independent Projects</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Built and deployed full-stack applications using React.js, Node.js, Express.js, and MongoDB. Developed a Restaurant Order & Kitchen Management System and EventSphere, implementing REST APIs, authentication, database operations, and interactive user interfaces.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI & Generative AI Developer</h4>
                <h5>Python, LangChain & RAG</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Exploring Generative AI and LLM application development. Built an HR Policy Assistant using Retrieval-Augmented Generation (RAG), Python, LangChain, and ChromaDB to retrieve information from policy documents and generate context-aware answers.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Competitive Programming & DSA</h4>
                <h5>LeetCode & Problem Solving</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Solved 225+ problems on LeetCode, strengthening problem-solving skills in arrays, strings, binary trees, recursion, sorting, searching, and other data structures and algorithms. Continuously improving algorithmic thinking and coding efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
