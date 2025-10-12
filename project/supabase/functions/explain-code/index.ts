const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ExplainCodeRequest {
  code: string;
  language: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { code, language }: ExplainCodeRequest = await req.json();

    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: 'Code and language are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Mock AI explanation for demo purposes
    // In production, you would call the actual Google Gemini API here
    const explanation = generateMockExplanation(code, language);

    return new Response(
      JSON.stringify({ explanation }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in explain-code function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateMockExplanation(code: string, language: string): string {
  const codeLines = code.split('\n').filter(line => line.trim()).length;
  const lines = code.split('\n');

  // Detect patterns
  const hasFunction = /function|def|func|method|=>|constructor/i.test(code);
  const hasClass = /class\s+\w+/i.test(code);
  const hasLoop = /for|while|forEach|map|filter|reduce/i.test(code);
  const hasConditional = /if|else|switch|case|\?|&&|\|\|/i.test(code);
  const hasAsync = /async|await|Promise|then|catch|\.then\(|\.catch\(/i.test(code);
  const hasImport = /import|require|from|export/i.test(code);
  const hasConst = /const|let|var/i.test(code);
  const hasArrow = /=>/i.test(code);
  const hasReturn = /return/i.test(code);
  const hasTry = /try|catch|finally/i.test(code);
  const hasArray = /\[|\]|Array|push|pop|shift|unshift/i.test(code);
  const hasObject = /\{.*:.*\}|Object|keys|values|entries/i.test(code);
  const hasAPI = /fetch|axios|http|request|response|api/i.test(code);
  const hasDOM = /document|window|querySelector|getElementById|addEventListener/i.test(code);
  const hasReact = /useState|useEffect|useCallback|useMemo|React|jsx|tsx|component/i.test(code);

  let explanation = `## Overview\n\nThis ${language} code snippet consists of ${codeLines} ${codeLines === 1 ? 'line' : 'lines'} of code. `;

  // Main purpose section
  explanation += "\n\n## Purpose\n\n";

  if (hasClass) {
    explanation += "This code defines a class structure, which is a blueprint for creating objects with specific properties and methods. Classes are fundamental to object-oriented programming and help organize code into reusable, maintainable units. ";
  } else if (hasFunction) {
    explanation += "This code defines one or more functions that encapsulate specific logic. Functions are essential building blocks that promote code reusability and help break down complex problems into manageable pieces. ";
  } else if (hasConst) {
    explanation += "This code declares variables and assigns values to them. Variable declarations are used to store and manage data throughout the program's execution. ";
  }

  // Implementation details
  explanation += "\n\n## Key Features\n\n";
  let features = [];

  if (hasAsync) {
    features.push("**Asynchronous Operations**: The code handles asynchronous operations using async/await or Promises. This is crucial for non-blocking operations like API calls, file I/O, or database queries. The asynchronous approach ensures the application remains responsive while waiting for these operations to complete.");
  }

  if (hasAPI) {
    features.push("**API Integration**: The code interacts with external APIs or web services. This typically involves making HTTP requests to fetch or send data to remote servers. Proper error handling and response parsing are important considerations when working with APIs.");
  }

  if (hasReact) {
    features.push("**React Integration**: This code uses React hooks or components, which are part of the React library for building user interfaces. React promotes a component-based architecture and declarative programming style for creating dynamic web applications.");
  }

  if (hasLoop) {
    features.push("**Iteration Logic**: The code includes loops or array methods for iterating over collections. This is commonly used to process multiple items, transform data, or perform repeated operations. Modern JavaScript array methods like map, filter, and reduce provide elegant ways to work with collections.");
  }

  if (hasConditional) {
    features.push("**Conditional Logic**: The code contains decision-making structures that execute different code paths based on specific conditions. This allows the program to respond dynamically to different inputs, states, or situations.");
  }

  if (hasTry) {
    features.push("**Error Handling**: The code implements try-catch blocks to gracefully handle potential errors. This is a best practice that prevents unexpected failures from crashing the application and allows for proper error recovery or user feedback.");
  }

  if (hasDOM) {
    features.push("**DOM Manipulation**: The code interacts with the Document Object Model to dynamically update the webpage. This includes selecting elements, modifying content, handling events, and creating interactive user experiences.");
  }

  if (hasArray || hasObject) {
    features.push("**Data Structures**: The code works with complex data structures like arrays or objects. These structures are essential for organizing and managing related data in a logical and accessible way.");
  }

  if (hasImport) {
    features.push("**Modular Design**: The code uses imports/exports to organize functionality across multiple files. This modular approach improves code maintainability, reusability, and makes it easier to manage large codebases.");
  }

  if (features.length > 0) {
    explanation += features.join("\n\n");
  } else {
    explanation += "This is a straightforward code snippet that performs basic operations. While simple, it serves as a building block for more complex functionality.";
  }

  // Usage section
  explanation += "\n\n## Usage Context\n\n";

  if (hasReact) {
    explanation += "This code is designed to be used within a React application, likely as part of a component's logic or custom hook. It follows React's conventions and integrates with the React lifecycle.";
  } else if (hasAPI) {
    explanation += "This code is typically used in scenarios where communication with external services is required. It's commonly found in service layers, API clients, or data-fetching utilities.";
  } else if (hasFunction && hasReturn) {
    explanation += "This code defines reusable functionality that can be imported and called from other parts of the application. The return values can be used for further processing or display.";
  } else if (hasDOM) {
    explanation += "This code runs in a browser environment and manipulates the webpage in response to user actions or application state changes.";
  } else {
    explanation += "This code snippet can be integrated into larger applications where its specific functionality is needed. It's designed to be modular and reusable across different contexts.";
  }

  explanation += "\n\n## Best Practices\n\n";
  explanation += "The code demonstrates several programming best practices including ";

  let practices = [];
  if (hasAsync) practices.push("proper asynchronous handling");
  if (hasConst) practices.push("immutable variable declarations");
  if (hasTry) practices.push("error handling");
  if (hasArrow) practices.push("modern ES6+ syntax");
  if (hasFunction) practices.push("functional decomposition");

  if (practices.length > 0) {
    explanation += practices.join(", ") + ". ";
  }

  explanation += "This makes the code more maintainable, readable, and robust for production use.";

  return explanation;
}