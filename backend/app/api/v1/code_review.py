from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re
import json

router = APIRouter(prefix="/ai", tags=["ai-code-review"])

class CodeReviewRequest(BaseModel):
    code: str
    language: str

class Suggestion(BaseModel):
    type: str  # 'performance', 'security', 'best-practice', 'bug'
    severity: str  # 'high', 'medium', 'low'
    line: Optional[int] = None
    message: str
    suggestion: Optional[str] = None
    corrected_code: Optional[str] = None  # Add corrected code field

class CodeAnalysis(BaseModel):
    readability: int
    maintainability: int
    performance: int
    security: int

class CodeReviewResponse(BaseModel):
    score: int
    analysis: CodeAnalysis
    suggestions: List[Suggestion]
    corrected_code: Optional[str] = None  # Add overall corrected code

@router.post("/review-code", response_model=CodeReviewResponse)
async def review_code(request: CodeReviewRequest):
    """
    AI-powered code review endpoint that analyzes code quality,
    provides suggestions, and gives a comprehensive score.
    """
    
    try:
        # For now, we'll use rule-based analysis
        # Later, this can be enhanced with actual AI integration
        
        code = request.code.strip()
        language = request.language.lower()
        
        if not code:
            raise HTTPException(status_code=400, detail="Code cannot be empty")
        
        # Analyze the code
        analysis_result = analyze_code_quality(code, language)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code analysis failed: {str(e)}")

def analyze_code_quality(code: str, language: str) -> CodeReviewResponse:
    """
    Comprehensive code analysis using pattern matching and heuristics.
    This can be enhanced with actual AI models like CodeBERT, GPT, etc.
    """
    
    lines = code.split('\n')
    suggestions = []
    
    # Language-specific analysis
    if language == 'javascript':
        suggestions.extend(analyze_javascript(code, lines))
    elif language == 'python':
        suggestions.extend(analyze_python(code, lines))
    elif language == 'java':
        suggestions.extend(analyze_java(code, lines))
    elif language == 'cpp':
        suggestions.extend(analyze_cpp(code, lines))
    
    # General code analysis
    suggestions.extend(analyze_general_patterns(code, lines))
    
    # Generate corrected code based on suggestions
    corrected_code = generate_corrected_code(code, suggestions, language)
    
    # Calculate metrics
    analysis = calculate_metrics(code, lines, suggestions)
    
    # Calculate overall score
    score = calculate_overall_score(analysis, len(suggestions))
    
    return CodeReviewResponse(
        score=score,
        analysis=analysis,
        suggestions=suggestions,
        corrected_code=corrected_code
    )

def analyze_javascript(code: str, lines: List[str]) -> List[Suggestion]:
    """Analyze JavaScript-specific patterns"""
    suggestions = []
    
    for i, line in enumerate(lines, 1):
        line_lower = line.lower().strip()
        
        # Check for var usage (suggest let/const)
        if re.search(r'\bvar\s+', line):
            # Generate corrected line
            if '=' in line:
                corrected_line = line.replace('var ', 'const ')
            else:
                corrected_line = line.replace('var ', 'let ')
            
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Use 'let' or 'const' instead of 'var'",
                suggestion="Modern JavaScript prefers block-scoped variables (let/const) over function-scoped (var)",
                corrected_code=corrected_line.strip()
            ))
        
        # Check for == instead of ===
        if '==' in line and '===' not in line and '!=' in line and '!==' not in line:
            corrected_line = line.replace('==', '===')
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Use strict equality (===) instead of loose equality (==)",
                suggestion="Strict equality prevents type coercion issues",
                corrected_code=corrected_line.strip()
            ))
        
        # Check for console.log in production
        if 'console.log' in line_lower:
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="Remove console.log statements in production code",
                suggestion="Use proper logging libraries or remove debug statements"
            ))
        
        # Check for eval usage
        if 'eval(' in line_lower:
            suggestions.append(Suggestion(
                type="security",
                severity="high",
                line=i,
                message="Avoid using eval() - security risk",
                suggestion="eval() can execute arbitrary code and is a security vulnerability"
            ))
    
    # Check for missing error handling
    if 'try' not in code.lower() and ('fetch(' in code or 'ajax' in code.lower()):
        suggestions.append(Suggestion(
            type="best-practice",
            severity="medium",
            message="Add error handling for async operations",
            suggestion="Use try-catch blocks or .catch() for error handling"
        ))
    
    return suggestions

def analyze_python(code: str, lines: List[str]) -> List[Suggestion]:
    """Analyze Python-specific patterns"""
    suggestions = []
    
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()
        
        # Check for bare except
        if re.search(r'except\s*:', line_stripped):
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Avoid bare except clauses",
                suggestion="Catch specific exceptions instead of using bare 'except:'"
            ))
        
        # Check for global variables
        if line_stripped.startswith('global '):
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Minimize use of global variables",
                suggestion="Consider passing variables as parameters or using classes"
            ))
        
        # Check for print statements (should use logging)
        if re.search(r'\bprint\s*\(', line_stripped):
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="Consider using logging instead of print",
                suggestion="Use the logging module for better control over output"
            ))
    
    # Check for missing docstrings
    if 'def ' in code and '"""' not in code and "'''" not in code:
        suggestions.append(Suggestion(
            type="best-practice",
            severity="low",
            message="Add docstrings to functions",
            suggestion="Document your functions with descriptive docstrings"
        ))
    
    return suggestions

def analyze_java(code: str, lines: List[str]) -> List[Suggestion]:
    """Analyze Java-specific patterns"""
    suggestions = []
    
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()
        
        # Check for System.out.println (should use logging)
        if 'System.out.print' in line_stripped:
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="Use logging framework instead of System.out.println",
                suggestion="Consider using java.util.logging or slf4j for better logging control"
            ))
        
        # Check for empty catch blocks
        if line_stripped == 'catch' and i < len(lines):
            next_lines = lines[i:i+3] if i+3 <= len(lines) else lines[i:]
            if any('{}' in line or ('{' in line and '}' in next_lines[j] and j <= 2) for j, line in enumerate(next_lines)):
                suggestions.append(Suggestion(
                    type="best-practice",
                    severity="high",
                    line=i,
                    message="Empty catch block - handle exceptions properly",
                    suggestion="Log the exception or handle it appropriately"
                ))
    
    return suggestions

def analyze_cpp(code: str, lines: List[str]) -> List[Suggestion]:
    """Analyze C++ specific patterns"""
    suggestions = []
    
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()
        
        # Check for C-style casts
        if re.search(r'\([A-Za-z_]\w*\s*\*?\s*\)', line_stripped):
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Use C++ style casts instead of C-style casts",
                suggestion="Use static_cast, dynamic_cast, const_cast, or reinterpret_cast"
            ))
        
        # Check for raw pointers
        if re.search(r'\w+\s*\*\s*\w+.*=.*new\b', line_stripped):
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Consider using smart pointers instead of raw pointers",
                suggestion="Use std::unique_ptr or std::shared_ptr for automatic memory management"
            ))
        
        # Check for missing const
        if 'void ' in line_stripped and '(' in line_stripped and 'const' not in line_stripped:
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="Consider making methods const when they don't modify state",
                suggestion="Add 'const' keyword to methods that don't modify object state"
            ))
    
    return suggestions

def analyze_general_patterns(code: str, lines: List[str]) -> List[Suggestion]:
    """Analyze general code quality patterns"""
    suggestions = []
    
    # Check line length
    for i, line in enumerate(lines, 1):
        if len(line) > 120:
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="Line too long (>120 characters)",
                suggestion="Break long lines for better readability"
            ))
    
    # Check for TODO/FIXME comments
    for i, line in enumerate(lines, 1):
        if re.search(r'(TODO|FIXME|HACK)', line, re.IGNORECASE):
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="TODO/FIXME comment found",
                suggestion="Address TODO items before deploying to production"
            ))
    
    # Check for magic numbers
    for i, line in enumerate(lines, 1):
        # Look for numeric literals (excluding common ones like 0, 1, -1)
        numbers = re.findall(r'\b(?<![\w.])\d{2,}\b(?![\w.])', line)
        if numbers:
            suggestions.append(Suggestion(
                type="best-practice",
                severity="low",
                line=i,
                message="Consider using named constants instead of magic numbers",
                suggestion="Define constants for numeric literals to improve readability"
            ))
    
    # Check for deeply nested code
    for i, line in enumerate(lines, 1):
        indent_level = len(line) - len(line.lstrip())
        if indent_level > 24:  # More than 6 levels of indentation (assuming 4 spaces)
            suggestions.append(Suggestion(
                type="best-practice",
                severity="medium",
                line=i,
                message="Code is deeply nested - consider refactoring",
                suggestion="Extract nested logic into separate functions"
            ))
    
    return suggestions

def calculate_metrics(code: str, lines: List[str], suggestions: List[Suggestion]) -> CodeAnalysis:
    """Calculate code quality metrics"""
    
    total_lines = len([line for line in lines if line.strip()])
    comment_lines = len([line for line in lines if line.strip().startswith(('#', '//', '/*', '*', '"""', "'''"))])
    
    # Calculate readability (based on comments, line length, complexity)
    comment_ratio = comment_lines / max(total_lines, 1)
    avg_line_length = sum(len(line) for line in lines) / max(len(lines), 1)
    
    readability = max(0, min(100, int(
        80 + (comment_ratio * 20) - (max(0, avg_line_length - 80) / 2)
    )))
    
    # Calculate maintainability (based on function size, nesting, suggestions)
    high_severity_count = len([s for s in suggestions if s.severity == 'high'])
    medium_severity_count = len([s for s in suggestions if s.severity == 'medium'])
    
    maintainability = max(0, min(100, int(
        90 - (high_severity_count * 10) - (medium_severity_count * 5)
    )))
    
    # Calculate performance (based on known performance anti-patterns)
    performance_issues = len([s for s in suggestions if s.type == 'performance'])
    performance = max(0, min(100, int(85 - (performance_issues * 15))))
    
    # Calculate security (based on security-related suggestions)
    security_issues = len([s for s in suggestions if s.type == 'security'])
    security = max(0, min(100, int(95 - (security_issues * 20))))
    
    return CodeAnalysis(
        readability=readability,
        maintainability=maintainability,
        performance=performance,
        security=security
    )

def calculate_overall_score(analysis: CodeAnalysis, suggestion_count: int) -> int:
    """Calculate overall code quality score"""
    
    # Weighted average of metrics
    base_score = (
        analysis.readability * 0.25 +
        analysis.maintainability * 0.30 +
        analysis.performance * 0.25 +
        analysis.security * 0.20
    )
    
    # Penalty for number of suggestions
    suggestion_penalty = min(suggestion_count * 2, 30)
    
    final_score = max(0, min(100, int(base_score - suggestion_penalty)))
    
    return final_score

def generate_corrected_code(code: str, suggestions: List[Suggestion], language: str) -> str:
    """
    Generate corrected code based on the suggestions provided.
    This function applies common fixes and improvements.
    """
    corrected_lines = code.split('\n')
    
    try:
        if language == 'javascript':
            corrected_lines = fix_javascript_issues(corrected_lines, suggestions)
        elif language == 'python':
            corrected_lines = fix_python_issues(corrected_lines, suggestions)
        elif language == 'java':
            corrected_lines = fix_java_issues(corrected_lines, suggestions)
        elif language == 'cpp':
            corrected_lines = fix_cpp_issues(corrected_lines, suggestions)
        
        # Apply general fixes
        corrected_lines = apply_general_fixes(corrected_lines, suggestions)
        
        return '\n'.join(corrected_lines)
    except Exception as e:
        # If correction fails, return original code with comment
        return f"// Auto-correction failed: {str(e)}\n// Original code:\n{code}"

def fix_javascript_issues(lines: List[str], suggestions: List[Suggestion]) -> List[str]:
    """Fix JavaScript-specific issues"""
    corrected_lines = lines.copy()
    
    for i, line in enumerate(corrected_lines):
        # Fix var to let/const
        if 'var ' in line and any(s.line == i+1 and 'var' in s.message for s in suggestions):
            if '=' in line:
                corrected_lines[i] = line.replace('var ', 'const ')
            else:
                corrected_lines[i] = line.replace('var ', 'let ')
        
        # Add semicolons
        if any(s.line == i+1 and 'semicolon' in s.message.lower() for s in suggestions):
            if not line.strip().endswith((';', '{', '}', ':')):
                corrected_lines[i] = line + ';'
        
        # Fix == to ===
        if '==' in line and '===' not in line and any(s.line == i+1 and 'strict' in s.message for s in suggestions):
            corrected_lines[i] = line.replace('==', '===')
    
    return corrected_lines

def fix_python_issues(lines: List[str], suggestions: List[Suggestion]) -> List[str]:
    """Fix Python-specific issues"""
    corrected_lines = lines.copy()
    
    for i, line in enumerate(corrected_lines):
        # Fix missing type hints
        if 'def ' in line and ')' in line and any(s.line == i+1 and 'type hint' in s.message for s in suggestions):
            if ' -> ' not in line:
                corrected_lines[i] = line.rstrip(':') + ' -> None:'
        
        # Add docstrings for functions
        if 'def ' in line and i < len(corrected_lines) - 1:
            if not corrected_lines[i+1].strip().startswith('"""'):
                indent = len(line) - len(line.lstrip())
                func_name = line.split('def ')[1].split('(')[0]
                docstring = ' ' * (indent + 4) + f'"""{func_name} function."""'
                corrected_lines.insert(i+1, docstring)
    
    return corrected_lines

def fix_java_issues(lines: List[str], suggestions: List[Suggestion]) -> List[str]:
    """Fix Java-specific issues"""
    corrected_lines = lines.copy()
    
    # Add basic Java fixes
    for i, line in enumerate(corrected_lines):
        # Add access modifiers
        if 'class ' in line and not any(mod in line for mod in ['public', 'private', 'protected']):
            corrected_lines[i] = 'public ' + line
    
    return corrected_lines

def fix_cpp_issues(lines: List[str], suggestions: List[Suggestion]) -> List[str]:
    """Fix C++-specific issues"""
    corrected_lines = lines.copy()
    
    # Add basic C++ fixes
    for i, line in enumerate(corrected_lines):
        # Add namespace std usage suggestion
        if 'cout' in line and 'std::' not in line:
            corrected_lines[i] = line.replace('cout', 'std::cout')
        if 'cin' in line and 'std::' not in line:
            corrected_lines[i] = line.replace('cin', 'std::cin')
        if 'endl' in line and 'std::' not in line:
            corrected_lines[i] = line.replace('endl', 'std::endl')
    
    return corrected_lines

def apply_general_fixes(lines: List[str], suggestions: List[Suggestion]) -> List[str]:
    """Apply general code improvements"""
    corrected_lines = lines.copy()
    
    # Remove trailing whitespace
    corrected_lines = [line.rstrip() for line in corrected_lines]
    
    # Ensure file ends with newline
    if corrected_lines and corrected_lines[-1]:
        corrected_lines.append('')
    
    return corrected_lines