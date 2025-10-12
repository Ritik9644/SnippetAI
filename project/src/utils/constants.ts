export const SUPPORTED_LANGUAGES = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  bash: 'Bash',
} as const;

export const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  javascript: `// Your JavaScript code here
function example() {
  return 'Hello, World!';
}`,
  typescript: `// Your TypeScript code here
interface Example {
  message: string;
}

function example(): Example {
  return { message: 'Hello, World!' };
}`,
  python: `# Your Python code here
def example():
    return "Hello, World!"`,
  java: `// Your Java code here
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
};