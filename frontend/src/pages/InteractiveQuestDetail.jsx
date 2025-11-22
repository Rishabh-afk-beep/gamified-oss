import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  LightBulbIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  SparklesIcon,
  FireIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function InteractiveQuestDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);

  // Enhanced quest data with detailed tasks
  const questDetails = {
    1: {
      id: 1,
      title: "Git Fundamentals",
      description: "Learn the basics of version control with Git. Master init, add, commit, and push commands.",
      difficulty: "beginner",
      xp_reward: 100,
      estimated_time: "30 minutes",
      color: "from-green-500 to-emerald-500",
      icon: CodeBracketIcon,
      tasks: [
        {
          id: 1,
          title: "Initialize a Git Repository",
          type: "terminal",
          description: "Learn how to create a new Git repository in your project folder.",
          content: `# Initializing a Git Repository

Git is a version control system that helps you track changes in your code. Let's start by creating your first repository!

## What you'll learn:
- How to initialize a Git repository
- Understanding the .git folder
- Basic Git concepts

## Instructions:
1. Open your terminal or command prompt
2. Navigate to your project folder
3. Run the git init command`,
          code: "git init",
          expectedOutput: "Initialized empty Git repository",
          hint: "Use 'git init' to initialize a new Git repository in the current directory.",
          points: 25
        },
        {
          id: 2,
          title: "Stage and Commit Files",
          type: "terminal",
          description: "Learn how to add files to the staging area and create your first commit.",
          content: `# Staging and Committing

Now that you have a Git repository, let's learn how to save your changes!

## The Git workflow:
1. **Working Directory** - Your files as you edit them
2. **Staging Area** - Files ready to be committed
3. **Repository** - Committed changes

## Instructions:
Create a simple HTML file and commit it to your repository.`,
          code: `echo "<html><body><h1>Hello Git!</h1></body></html>" > index.html
git add index.html
git commit -m "Initial commit: Add index.html"`,
          expectedOutput: "1 file changed",
          hint: "Remember to add files to staging with 'git add' before committing with 'git commit'.",
          points: 35
        },
        {
          id: 3,
          title: "Check Repository Status",
          type: "terminal",
          description: "Learn how to check the status of your Git repository.",
          content: `# Checking Git Status

It's important to understand what's happening in your repository. The git status command is your best friend!

## What git status shows:
- Modified files
- Staged files
- Untracked files
- Current branch information

## Instructions:
Check the current status of your repository.`,
          code: "git status",
          expectedOutput: "working tree clean",
          hint: "Use 'git status' to see the current state of your working directory and staging area.",
          points: 40
        }
      ]
    },
    2: {
      id: 2,
      title: "JavaScript Arrays & Objects",
      description: "Master JavaScript data structures. Learn to manipulate arrays and work with objects effectively.",
      difficulty: "beginner",
      xp_reward: 150,
      estimated_time: "45 minutes",
      color: "from-blue-500 to-indigo-500",
      icon: LightBulbIcon,
      tasks: [
        {
          id: 1,
          title: "Working with Arrays",
          type: "code",
          description: "Learn to create and manipulate JavaScript arrays.",
          content: `# JavaScript Arrays

Arrays are ordered lists that can store multiple values. They're one of the most important data structures in JavaScript!

## Array Basics:
- Arrays use square brackets: []
- Elements are separated by commas
- Arrays are zero-indexed (first element is at index 0)

## Common Array Methods:
- push() - adds to end
- pop() - removes from end
- unshift() - adds to beginning
- shift() - removes from beginning

## Your Task:
Create an array of your favorite programming languages and add a new language to it.`,
          code: `// Create an array of programming languages
const languages = ['JavaScript', 'Python', 'Java'];

// Add a new language
languages.push('React');

// Display the result
console.log(languages);`,
          expectedOutput: "['JavaScript', 'Python', 'Java', 'React']",
          hint: "Use the push() method to add elements to the end of an array.",
          points: 50
        },
        {
          id: 2,
          title: "Array Methods - Map, Filter, Reduce",
          type: "code",
          description: "Learn powerful array methods for data transformation.",
          content: `# Powerful Array Methods

JavaScript provides powerful methods to work with arrays functionally:

## Map - Transform each element
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8]

## Filter - Keep elements that match condition
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0); // [2, 4, 6]

## Reduce - Combine all elements into single value
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, n) => acc + n, 0); // 10

## Your Task:
Given an array of numbers, create a new array with only even numbers doubled.`,
          code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = numbers
  .filter(n => n % 2 === 0)  // Keep only even numbers
  .map(n => n * 2);          // Double each number

console.log(result);`,
          expectedOutput: "[4, 8, 12, 16, 20]",
          hint: "Chain filter() and map() methods to first filter even numbers, then double them.",
          points: 50
        },
        {
          id: 3,
          title: "Working with Objects",
          type: "code",
          description: "Learn to create and manipulate JavaScript objects.",
          content: `# JavaScript Objects

Objects store data in key-value pairs and are perfect for representing real-world entities.

## Object Basics:
- Objects use curly braces: {}
- Properties are key-value pairs
- Access with dot notation or bracket notation

## Your Task:
Create a user object and add a method to calculate their age.`,
          code: `const user = {
  name: 'John Doe',
  birthYear: 1990,
  email: 'john@example.com',
  
  // Method to calculate age
  getAge: function() {
    return new Date().getFullYear() - this.birthYear;
  }
};

console.log(\`\${user.name} is \${user.getAge()} years old\`);`,
          expectedOutput: "John Doe is 35 years old",
          hint: "Use 'this' keyword to access object properties within methods.",
          points: 50
        }
      ]
    },
    3: {
      id: 3,
      title: "React Component Basics",
      description: "Learn to build reusable React components with props and state management.",
      difficulty: "intermediate",
      xp_reward: 200,
      estimated_time: "1 hour",
      color: "from-purple-500 to-pink-500",
      icon: SparklesIcon,
      tasks: [
        {
          id: 1,
          title: "Creating Your First Component",
          type: "code",
          description: "Learn to create functional React components.",
          content: `# React Components

Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

## Functional Components:
- Use JavaScript functions
- Return JSX
- Can accept props as parameters

## Your Task:
Create a simple greeting component that takes a name as a prop.`,
          code: `function Greeting({ name }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to React</p>
    </div>
  );
}

// Usage
function App() {
  return <Greeting name="World" />;
}`,
          expectedOutput: "Hello, World! Welcome to React",
          hint: "Use curly braces {} to embed JavaScript expressions in JSX.",
          points: 60
        },
        {
          id: 2,
          title: "Using Props",
          type: "code",
          description: "Learn to pass data between components using props.",
          content: `# Props in React

Props (properties) are how you pass data from parent to child components. They make components reusable!

## Props Rules:
- Props are read-only
- Passed down from parent to child
- Can be any data type

## Your Task:
Create a UserCard component that displays user information.`,
          code: `function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <span>Level: {user.level}</span>
    </div>
  );
}

// Usage
const user = {
  name: "Alice",
  email: "alice@example.com",
  level: 5,
  avatar: "https://example.com/avatar.jpg"
};

function App() {
  return <UserCard user={user} />;
}`,
          expectedOutput: "User card with Alice's info",
          hint: "Access object properties using dot notation: user.name, user.email, etc.",
          points: 70
        },
        {
          id: 3,
          title: "Managing State with useState",
          type: "code",
          description: "Learn to manage component state with the useState hook.",
          content: `# useState Hook

State lets components remember and update information. useState is the most common React hook.

## useState Basics:
- Returns current state and setter function
- State updates trigger re-renders
- Initial state can be any value

## Your Task:
Create a counter component with increment and decrement buttons.`,
          code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}`,
          expectedOutput: "Interactive counter with buttons",
          hint: "Call the setter function returned by useState to update state.",
          points: 70
        }
      ]
    },
    4: {
      id: 4,
      title: "GitHub Pull Requests",
      description: "Master the art of creating and managing pull requests on GitHub.",
      difficulty: "intermediate",
      xp_reward: 250,
      estimated_time: "1.5 hours", 
      color: "from-orange-500 to-red-500",
      icon: FireIcon,
      tasks: [
        {
          id: 1,
          title: "Fork a Repository",
          type: "tutorial",
          description: "Learn how to fork repositories to contribute to open source projects.",
          content: `# Forking on GitHub

Forking creates a personal copy of someone else's repository. This is the first step in contributing to open source!

## What happens when you fork:
- Creates a copy in your GitHub account
- Maintains connection to original repo
- Allows you to make changes safely

## Steps to fork:
1. Navigate to the repository you want to fork
2. Click the "Fork" button (top right)
3. Choose your account as destination
4. Wait for GitHub to create the copy

## Your Task:
Fork a popular open source repository and clone it locally.`,
          code: `# After forking, clone your fork
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Add original repository as upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/REPO_NAME.git

# Verify remotes
git remote -v`,
          expectedOutput: "Repository forked and cloned successfully",
          hint: "Always add the original repository as 'upstream' remote for easier syncing.",
          points: 80
        },
        {
          id: 2,
          title: "Create a Feature Branch",
          type: "terminal",
          description: "Learn to create dedicated branches for your changes.",
          content: `# Git Branching for Pull Requests

Branches allow you to work on features without affecting the main code. Essential for clean PRs!

## Branch Best Practices:
- Use descriptive names (fix-login-bug, add-dark-theme)
- One feature per branch
- Keep branches focused and small

## Your Task:
Create a new branch for a feature you want to add.`,
          code: `# Create and switch to new branch
git checkout -b add-new-feature

# Or using newer syntax
git switch -c add-new-feature

# Verify you're on the new branch
git branch`,
          expectedOutput: "* add-new-feature",
          hint: "Use descriptive branch names that explain what you're working on.",
          points: 60
        },
        {
          id: 3,
          title: "Make Changes and Commit",
          type: "tutorial",
          description: "Make meaningful changes and create a good commit.",
          content: `# Making Quality Commits

Good commits are the foundation of great pull requests. They should be clear, focused, and well-documented.

## Commit Best Practices:
- Write clear, descriptive commit messages
- Make atomic commits (one logical change)
- Test your changes before committing

## Your Task:
Make a small improvement and commit it properly.`,
          code: `# Make your changes to files
echo "# New Feature\\nThis adds awesome functionality" >> README.md

# Stage the changes
git add README.md

# Commit with a good message
git commit -m "docs: Add new feature description to README

- Explain the awesome functionality
- Improve documentation clarity"`,
          expectedOutput: "1 file changed, 2 insertions(+)",
          hint: "Follow conventional commit format: type(scope): description",
          points: 70
        },
        {
          id: 4,
          title: "Push and Create Pull Request",
          type: "tutorial",
          description: "Push your branch and create a pull request on GitHub.",
          content: `# Creating Pull Requests

Pull requests let you propose changes to a repository. They're where code review and collaboration happen!

## PR Best Practices:
- Write clear titles and descriptions
- Reference issues if applicable
- Add screenshots for UI changes
- Request appropriate reviewers

## Your Task:
Push your branch and create a pull request.`,
          code: `# Push your branch to your fork
git push origin add-new-feature

# Then go to GitHub and:
# 1. Navigate to your fork
# 2. Click "Compare & pull request"
# 3. Write a clear title and description
# 4. Click "Create pull request"`,
          expectedOutput: "Pull request created successfully",
          hint: "Include 'Fixes #issue-number' in PR description to auto-close related issues.",
          points: 90
        }
      ]
    },
    5: {
      id: 5,
      title: "JavaScript ES6+ Features",
      description: "Explore modern JavaScript features like arrow functions, destructuring, and async/await.",
      difficulty: "intermediate",
      xp_reward: 200,
      estimated_time: "1 hour",
      color: "from-yellow-500 to-orange-500",
      icon: LightBulbIcon,
      tasks: [
        {
          id: 1,
          title: "Arrow Functions & Template Literals",
          type: "code",
          description: "Learn modern function syntax and string interpolation.",
          content: `# ES6+ Modern JavaScript

Modern JavaScript offers cleaner syntax and powerful features that make code more readable and efficient.

## Arrow Functions:
- Shorter syntax for functions
- Implicit return for single expressions
- Lexical 'this' binding

## Template Literals:
- Use backticks (\`) instead of quotes
- Embed expressions with \${variable}
- Multi-line strings support

## Your Task:
Convert traditional functions to arrow functions and use template literals.`,
          code: `// Traditional function
const greet = function(name, age) {
  return "Hello, " + name + "! You are " + age + " years old.";
};

// Convert to arrow function with template literal
const greetModern = (name, age) => {
  return \`Hello, \${name}! You are \${age} years old.\`;
};

// Even shorter for single expressions
const greetShort = (name, age) => \`Hello, \${name}! You are \${age} years old.\`;

console.log(greetShort("Alice", 25));`,
          expectedOutput: "Hello, Alice! You are 25 years old.",
          hint: "Use \${} inside backticks to embed variables in template literals.",
          points: 60
        },
        {
          id: 2,
          title: "Destructuring Assignment",
          type: "code",
          description: "Learn to extract values from arrays and objects efficiently.",
          content: `# Destructuring Assignment

Destructuring lets you extract values from arrays and objects into distinct variables. It's a clean way to work with data!

## Array Destructuring:
const [first, second] = [1, 2, 3]; // first = 1, second = 2

## Object Destructuring:
const {name, age} = {name: "John", age: 30};

## Your Task:
Use destructuring to extract user information and array elements.`,
          code: `const user = {
  name: "Sarah",
  email: "sarah@example.com",
  address: {
    city: "New York",
    country: "USA"
  }
};

const hobbies = ["reading", "coding", "gaming", "music"];

// Destructure user object
const { name, email, address: { city } } = user;

// Destructure array
const [firstHobby, secondHobby, ...otherHobbies] = hobbies;

console.log(\`\${name} from \${city} likes \${firstHobby} and \${secondHobby}\`);
console.log("Other hobbies:", otherHobbies);`,
          expectedOutput: "Sarah from New York likes reading and coding",
          hint: "Use : to rename variables when destructuring objects, and ... for rest elements.",
          points: 70
        },
        {
          id: 3,
          title: "Async/Await",
          type: "code",
          description: "Master asynchronous JavaScript with async/await syntax.",
          content: `# Async/Await

Async/await makes asynchronous code look and behave more like synchronous code, making it easier to read and debug.

## Promise vs Async/Await:
// Promise chain
fetch('/api/user').then(res => res.json()).then(data => console.log(data));

// Async/await
const data = await fetch('/api/user').then(res => res.json());

## Your Task:
Create an async function that simulates fetching user data.`,
          code: `// Simulate an API call
const fetchUserData = async (userId) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate API response
    const userData = {
      id: userId,
      name: "John Doe",
      email: "john@example.com",
      posts: 42
    };
    
    return userData;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

// Usage
const displayUser = async () => {
  const user = await fetchUserData(123);
  console.log(\`User: \${user.name} (\${user.email}) has \${user.posts} posts\`);
};

displayUser();`,
          expectedOutput: "User: John Doe (john@example.com) has 42 posts",
          hint: "Always use try/catch with async/await to handle errors properly.",
          points: 70
        }
      ]
    },
    6: {
      id: 6,
      title: "Node.js Backend Basics",
      description: "Build REST APIs with Node.js and Express. Learn routing, middleware, and database integration.",
      difficulty: "intermediate",
      xp_reward: 300,
      estimated_time: "2 hours",
      color: "from-green-600 to-blue-600",
      icon: CodeBracketIcon,
      tasks: [
        {
          id: 1,
          title: "Express Server Setup",
          type: "code",
          description: "Create your first Express.js server with basic routing.",
          content: `# Express.js Fundamentals

Express.js is a minimal web framework for Node.js that provides powerful features for building web applications and APIs.

## Key Concepts:
- Server setup and configuration
- Routing (GET, POST, PUT, DELETE)
- Middleware functions
- Request and response objects

## Your Task:
Create a basic Express server with multiple routes.`,
          code: `const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my API!' });
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  res.json({ message: \`User \${name} created successfully!\` });
});

// Start server
app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`,
          expectedOutput: "Server running at http://localhost:3000",
          hint: "Use app.use(express.json()) to parse JSON request bodies.",
          points: 80
        },
        {
          id: 2,
          title: "Middleware Functions",
          type: "code",
          description: "Learn to create and use middleware for authentication and logging.",
          content: `# Express Middleware

Middleware functions execute during the request-response cycle. They can modify req/res objects or end the cycle.

## Common Middleware Uses:
- Authentication and authorization
- Logging and analytics
- Error handling
- Request parsing

## Your Task:
Create custom middleware for logging and authentication.`,
          code: `const express = require('express');
const app = express();

// Logging middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] \${req.method} \${req.path}\`);
  next(); // Pass control to next middleware
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // Simulate token validation
  if (token === 'Bearer valid-token') {
    req.user = { id: 1, name: 'Alice' };
    next();
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Apply middleware
app.use(logger);

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000);`,
          expectedOutput: "Middleware functions created",
          hint: "Always call next() in middleware unless you're ending the request-response cycle.",
          points: 90
        },
        {
          id: 3,
          title: "Database Integration",
          type: "code",
          description: "Connect your API to a database and perform CRUD operations.",
          content: `# Database Integration

Most APIs need to persist data. We'll simulate database operations with an in-memory store.

## CRUD Operations:
- Create: Add new records
- Read: Retrieve data
- Update: Modify existing records
- Delete: Remove records

## Your Task:
Build a complete user management API with CRUD operations.`,
          code: `const express = require('express');
const app = express();
app.use(express.json());

// In-memory database simulation
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000);`,
          expectedOutput: "Complete CRUD API created",
          hint: "Use appropriate HTTP status codes: 200 (OK), 201 (Created), 404 (Not Found), 204 (No Content).",
          points: 130
        }
      ]
    },
    7: {
      id: 7,
      title: "CSS Grid & Flexbox Mastery",
      description: "Master modern CSS layout techniques with Grid and Flexbox for responsive designs.",
      difficulty: "intermediate",
      xp_reward: 180,
      estimated_time: "1.5 hours",
      color: "from-pink-500 to-purple-500",
      icon: SparklesIcon,
      tasks: [
        {
          id: 1,
          title: "Flexbox Fundamentals",
          type: "code",
          description: "Learn to create flexible layouts with Flexbox.",
          content: `# Flexbox Layout

Flexbox is perfect for one-dimensional layouts. It excels at distributing space and aligning items.

## Key Flexbox Properties:
- display: flex - Creates flex container
- flex-direction - Defines main axis
- justify-content - Aligns along main axis
- align-items - Aligns along cross axis
- flex-grow/shrink/basis - Controls item flexibility

## Your Task:
Create a responsive navigation bar using Flexbox.`,
          code: `<!DOCTYPE html>
<html>
<head>
<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
}

.nav-links li {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-links li:hover {
  background: rgba(255,255,255,0.2);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
}
</style>
</head>
<body>

<nav class="navbar">
  <div class="logo">MyApp</div>
  <ul class="nav-links">
    <li>Home</li>
    <li>About</li>
    <li>Services</li>
    <li>Contact</li>
  </ul>
</nav>

</body>
</html>`,
          expectedOutput: "Responsive flexbox navigation created",
          hint: "Use flex-direction: column for mobile layouts and gap for consistent spacing.",
          points: 60
        },
        {
          id: 2,
          title: "CSS Grid Layout",
          type: "code",
          description: "Create complex layouts with CSS Grid system.",
          content: `# CSS Grid Layout

CSS Grid is powerful for two-dimensional layouts. Perfect for complex page structures and card layouts.

## Grid Properties:
- grid-template-columns/rows - Define grid structure
- grid-gap - Space between grid items
- grid-area - Position items in specific areas
- auto-fit/auto-fill - Responsive grid sizing

## Your Task:
Build a responsive card layout using CSS Grid.`,
          code: `<!DOCTYPE html>
<html>
<head>
<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  padding: 2rem;
  background: #f5f7fa;
}

.card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  height: 200px;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.card-content {
  padding: 1.5rem;
}

.card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.card p {
  color: #666;
  line-height: 1.6;
}

/* Featured card spans 2 columns */
.card.featured {
  grid-column: span 2;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.card.featured .card-header {
  background: rgba(255,255,255,0.2);
}
</style>
</head>
<body>

<div class="grid-container">
  <div class="card featured">
    <div class="card-header">⭐</div>
    <div class="card-content">
      <h3>Featured Project</h3>
      <p>This is a special featured project that spans multiple columns in our grid layout.</p>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">🚀</div>
    <div class="card-content">
      <h3>Project Alpha</h3>
      <p>Amazing project with cool features and modern design.</p>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">🎨</div>
    <div class="card-content">
      <h3>Project Beta</h3>
      <p>Creative solution for modern web development challenges.</p>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">⚡</div>
    <div class="card-content">
      <h3>Project Gamma</h3>
      <p>High-performance application built with latest technologies.</p>
    </div>
  </div>
</div>

</body>
</html>`,
          expectedOutput: "Responsive grid layout created",
          hint: "Use grid-column: span 2 to make items span multiple columns.",
          points: 80
        },
        {
          id: 3,
          title: "Combined Layout Mastery",
          type: "code",
          description: "Combine Grid and Flexbox for a complete page layout.",
          content: `# Grid + Flexbox Combination

Use Grid for page structure and Flexbox for component layouts. This creates the most flexible and maintainable layouts.

## Best Practices:
- Grid for 2D page layout
- Flexbox for 1D component layout
- Mobile-first responsive design
- Semantic HTML structure

## Your Task:
Create a complete responsive page layout combining both techniques.`,
          code: `<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
}

/* Main page grid */
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Header with flexbox */
.header {
  grid-area: header;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav a:hover {
  background: rgba(255,255,255,0.2);
}

/* Sidebar */
.sidebar {
  grid-area: sidebar;
  background: white;
  padding: 2rem;
  border-right: 1px solid #e2e8f0;
}

/* Main content with grid */
.main {
  grid-area: main;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  align-content: start;
}

.content-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Footer */
.footer {
  grid-area: footer;
  background: #2d3748;
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .page-layout {
    grid-template-areas: 
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>
</head>
<body>

<div class="page-layout">
  <header class="header">
    <h1>Dashboard</h1>
    <nav class="nav">
      <a href="#home">Home</a>
      <a href="#projects">Projects</a>
      <a href="#settings">Settings</a>
    </nav>
  </header>
  
  <aside class="sidebar">
    <h3>Navigation</h3>
    <ul>
      <li>Dashboard</li>
      <li>Analytics</li>
      <li>Reports</li>
      <li>Settings</li>
    </ul>
  </aside>
  
  <main class="main">
    <div class="content-card">
      <h3>Welcome!</h3>
      <p>This layout combines CSS Grid and Flexbox for maximum flexibility.</p>
    </div>
    <div class="content-card">
      <h3>Statistics</h3>
      <p>Your performance metrics and key indicators.</p>
    </div>
    <div class="content-card">
      <h3>Recent Activity</h3>
      <p>Latest updates and activities from your projects.</p>
    </div>
  </main>
  
  <footer class="footer">
    <p>&copy; 2025 My Dashboard. Built with Grid + Flexbox.</p>
  </footer>
</div>

</body>
</html>`,
          expectedOutput: "Complete responsive layout created",
          hint: "Use grid-template-areas for semantic layout definition and mobile-first responsive design.",
          points: 100
        }
      ]
    },
    8: {
      id: 8,
      title: "Python Data Structures",
      description: "Master Python lists, dictionaries, sets, and tuples for effective data manipulation.",
      difficulty: "beginner",
      xp_reward: 120,
      estimated_time: "45 minutes",
      color: "from-blue-600 to-green-500",
      icon: CodeBracketIcon,
      tasks: [
        {
          id: 1,
          title: "Working with Lists",
          type: "code",
          description: "Master Python lists and their powerful methods.",
          content: `# Python Lists

Lists are ordered, mutable collections that can store any type of data. They're one of the most versatile data structures in Python.

## List Features:
- Ordered and indexed (starting from 0)
- Mutable (can be changed)
- Allow duplicate values
- Can store mixed data types

## Common Methods:
- append() - Add item to end
- insert() - Add item at specific position
- remove() - Remove first occurrence
- pop() - Remove and return item

## Your Task:
Create and manipulate a list of programming languages.`,
          code: `# Create a list of programming languages
languages = ['Python', 'JavaScript', 'Java', 'C++']

# Add new languages
languages.append('Go')
languages.insert(1, 'TypeScript')  # Insert at index 1

# Remove a language
languages.remove('C++')

# List comprehension - create new list with languages that start with 'J'
j_languages = [lang for lang in languages if lang.startswith('J')]

# Print results
print("All languages:", languages)
print("Languages starting with J:", j_languages)
print("First language:", languages[0])
print("Last language:", languages[-1])

# Slicing
print("First 3 languages:", languages[:3])`,
          expectedOutput: "All languages: ['Python', 'TypeScript', 'JavaScript', 'Java', 'Go']",
          hint: "Use negative indices to access elements from the end of the list.",
          points: 40
        },
        {
          id: 2,
          title: "Dictionary Operations",
          type: "code",
          description: "Learn to work with Python dictionaries for key-value data storage.",
          content: `# Python Dictionaries

Dictionaries store data as key-value pairs. They're perfect for representing structured data like user profiles, configurations, etc.

## Dictionary Features:
- Unordered (Python 3.7+ maintains insertion order)
- Mutable and indexed by keys
- Keys must be immutable (strings, numbers, tuples)
- Values can be any data type

## Common Methods:
- get() - Safe key access
- keys()/values()/items() - Access parts
- update() - Merge dictionaries

## Your Task:
Create a user profile system using dictionaries.`,
          code: `# Create user profiles
user1 = {
    'name': 'Alice Johnson',
    'age': 28,
    'email': 'alice@example.com',
    'skills': ['Python', 'Machine Learning', 'Data Analysis'],
    'is_active': True
}

user2 = {
    'name': 'Bob Smith',
    'age': 32,
    'email': 'bob@example.com',
    'skills': ['JavaScript', 'React', 'Node.js']
}

# Create a users database
users_db = {
    'alice': user1,
    'bob': user2
}

# Add new skill to Alice
users_db['alice']['skills'].append('TensorFlow')

# Safe access with get()
alice_age = users_db.get('alice', {}).get('age', 'Unknown')

# Dictionary comprehension - get all user names
user_names = {username: data['name'] for username, data in users_db.items()}

print("User names:", user_names)
print("Alice's skills:", users_db['alice']['skills'])
print("Alice's age:", alice_age)

# Iterate through users
for username, profile in users_db.items():
    print(f"{profile['name']} ({username}) knows {len(profile['skills'])} skills")`,
          expectedOutput: "User names: {'alice': 'Alice Johnson', 'bob': 'Bob Smith'}",
          hint: "Use get() method to safely access dictionary keys that might not exist.",
          points: 50
        },
        {
          id: 3,
          title: "Sets and Tuples",
          type: "code",
          description: "Explore sets for unique collections and tuples for immutable data.",
          content: `# Sets and Tuples

Sets and tuples serve specific purposes in Python's data structure ecosystem.

## Sets:
- Unordered collections of unique elements
- Mutable (can add/remove items)
- Great for removing duplicates
- Support set operations (union, intersection)

## Tuples:
- Ordered and immutable
- Perfect for fixed collections
- Can be used as dictionary keys
- Memory efficient

## Your Task:
Use sets and tuples for data analysis tasks.`,
          code: `# Working with Sets
python_developers = {'Alice', 'Bob', 'Charlie', 'Diana'}
javascript_developers = {'Bob', 'Eve', 'Frank', 'Diana'}

# Set operations
full_stack = python_developers & javascript_developers  # intersection
all_developers = python_developers | javascript_developers  # union
python_only = python_developers - javascript_developers  # difference

print("Full-stack developers:", full_stack)
print("All developers:", all_developers)
print("Python-only developers:", python_only)

# Remove duplicates from a list
languages = ['Python', 'Java', 'Python', 'C++', 'Java', 'Go']
unique_languages = list(set(languages))
print("Unique languages:", unique_languages)

# Working with Tuples
# Representing coordinates
point = (10, 20)
x, y = point  # tuple unpacking

# Named tuple-like structure
person = ('John Doe', 30, 'Engineer')
name, age, job = person

# Tuples as dictionary keys
locations = {
    (0, 0): 'Origin',
    (10, 20): 'Point A',
    (-5, 15): 'Point B'
}

print(f"Point ({x}, {y}) is at:", locations.get(point, 'Unknown'))
print(f"Person: {name}, Age: {age}, Job: {job}")

# Count occurrences
numbers = (1, 2, 3, 2, 1, 2, 4)
print("Count of 2:", numbers.count(2))
print("Index of first 3:", numbers.index(3))`,
          expectedOutput: "Full-stack developers: {'Bob', 'Diana'}",
          hint: "Use set operations (&, |, -) for efficient data comparisons and analysis.",
          points: 50
        }
      ]
    }
  };

  const quest = questDetails[parseInt(questId)];
  const currentTask = quest?.tasks[currentTaskIndex];
  const progressPercent = (completedTasks.size / quest?.tasks.length) * 100;

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Quest not found</h1>
          <button 
            onClick={() => navigate('/quests')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  const handleCompleteTask = () => {
    if (currentTask) {
      setCompletedTasks(prev => new Set([...prev, currentTask.id]));
      
      if (currentTaskIndex < quest.tasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
      } else {
        setQuestCompleted(true);
        // Award XP to user (integrate with backend)
        console.log(`Quest completed! +${quest.xp_reward} XP`);
      }
      setUserCode('');
      setShowHint(false);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
    }
  };

  const handleNextTask = () => {
    if (currentTaskIndex < quest.tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${quest.color} text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/quests')}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">{quest.title}</h1>
                <p className="text-white/80 mt-2">{quest.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <StarIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-xl font-bold">{quest.xp_reward} XP</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm">{quest.estimated_time}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {questCompleted ? (
          // Quest Completion Screen
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-12 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleSolid className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">🎉 Quest Completed!</h2>
              <p className="text-xl text-gray-600">Congratulations! You've mastered {quest.title}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                <SparklesIcon className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-bold text-yellow-800 mb-2">XP Earned</h3>
                <p className="text-3xl font-bold text-yellow-600">+{quest.xp_reward}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <AcademicCapIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 mb-2">Tasks Completed</h3>
                <p className="text-3xl font-bold text-green-600">{quest.tasks.length}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <FireIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-bold text-purple-800 mb-2">Time Spent</h3>
                <p className="text-3xl font-bold text-purple-600">{quest.estimated_time}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/quests')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 mx-2"
              >
                Explore More Quests
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 mx-2"
              >
                View Dashboard
              </button>
            </div>
          </div>
        ) : (
          // Task Content
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Task Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Task {currentTaskIndex + 1}: {currentTask?.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
                    {currentTask?.type}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{currentTask?.description}</p>

                {/* Task Content */}
                <div className="prose max-w-none mb-8">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {currentTask?.content}
                  </pre>
                </div>

                {/* Code Editor */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {currentTask?.type === 'code' ? 'Code Editor' : 'Terminal'}
                    </h3>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <LightBulbIcon className="w-4 h-4" />
                      <span className="text-sm">{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                    </button>
                  </div>

                  {showHint && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">💡 {currentTask?.hint}</p>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={userCode || currentTask?.code || ''}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-40 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder={`Enter your ${currentTask?.type} here...`}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {currentTask?.type === 'code' ? 'JavaScript' : 'Terminal'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePreviousTask}
                    disabled={currentTaskIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleCompleteTask}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Complete Task (+{currentTask?.points} pts)</span>
                    </button>

                    <button
                      onClick={handleNextTask}
                      disabled={currentTaskIndex === quest.tasks.length - 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span>Skip</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task List */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quest Tasks</h3>
                <div className="space-y-3">
                  {quest.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        completedTasks.has(task.id)
                          ? 'bg-green-50 border border-green-200'
                          : index === currentTaskIndex
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentTaskIndex(index)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        completedTasks.has(task.id)
                          ? 'bg-green-500 text-white'
                          : index === currentTaskIndex
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {completedTasks.has(task.id) ? (
                          <CheckCircleSolid className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          completedTasks.has(task.id) ? 'text-green-800' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">{task.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quest Info */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quest Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      quest.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      quest.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total XP</span>
                    <span className="text-sm font-semibold text-gray-800">{quest.xp_reward}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Time</span>
                    <span className="text-sm font-semibold text-gray-800">{quest.estimated_time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasks</span>
                    <span className="text-sm font-semibold text-gray-800">{quest.tasks.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}