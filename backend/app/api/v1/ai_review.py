from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import re
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Code Review"])

class IssueContext(BaseModel):
    title: str
    description: Optional[str] = ""
    labels: List[str] = []

class CodeReviewRequest(BaseModel):
    code: str
    language: str
    issue_context: Optional[IssueContext] = None

class Suggestion(BaseModel):
    type: str  # 'security', 'performance', 'best-practice', 'syntax', 'readability'
    severity: str  # 'high', 'medium', 'low'
    line: Optional[int] = None
    message: str
    suggestion: str

class CodeAnalysis(BaseModel):
    readability: int
    maintainability: int
    performance: int
    security: int

class CodeReviewResponse(BaseModel):
    score: int
    analysis: CodeAnalysis
    suggestions: List[Suggestion]
    summary: str

@router.post("/review-code", response_model=CodeReviewResponse)
async def review_code(request: CodeReviewRequest):
    """
    AI-powered code review with GitHub issue context
    """
    try:
        # For now, return detailed static analysis
        # In production, this would integrate with Gemini AI
        
        suggestions = []
        analysis_scores = {
            'readability': 75,
            'maintainability': 80,
            'performance': 70,
            'security': 85
        }
        
        # Analyze code patterns
        code_lines = request.code.split('\n')
        
        # Security checks
        security_patterns = [
            (r'eval\s*\(', "Avoid using eval() as it can execute arbitrary code", "high"),
            (r'innerHTML\s*=', "Using innerHTML can lead to XSS vulnerabilities", "medium"),
            (r'document\.write\s*\(', "document.write is deprecated and unsafe", "medium"),
            (r'SELECT\s+\*\s+FROM', "Avoid SELECT * queries for better performance", "low"),
            (r'password.*=.*[\'"][^\'"]{1,8}[\'"]', "Weak password detected", "high")
        ]
        
        for i, line in enumerate(code_lines, 1):
            for pattern, message, severity in security_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    suggestions.append(Suggestion(
                        type="security",
                        severity=severity,
                        line=i,
                        message=message,
                        suggestion=f"Review line {i} for security best practices"
                    ))
        
        # Performance checks
        performance_patterns = [
            (r'for.*in.*\.length', "Cache array length in loops for better performance", "low"),
            (r'document\.getElementById.*loop', "Avoid DOM queries in loops", "medium"),
            (r'setTimeout\s*\(\s*.*\s*,\s*0\s*\)', "Using setTimeout with 0ms might cause performance issues", "low")
        ]
        
        for i, line in enumerate(code_lines, 1):
            for pattern, message, severity in performance_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    suggestions.append(Suggestion(
                        type="performance",
                        severity=severity,
                        line=i,
                        message=message,
                        suggestion=f"Optimize line {i} for better performance"
                    ))
        
        # Code quality checks
        quality_patterns = [
            (r'function\s+\w+\s*\([^)]*\)\s*\{[^}]*\}', "Consider adding JSDoc comments for functions", "low"),
            (r'var\s+', "Use const/let instead of var for better scoping", "medium"),
            (r'==\s*[^=]', "Use === for strict equality comparison", "medium"),
            (r'console\.log', "Remove console.log statements before production", "low")
        ]
        
        for i, line in enumerate(code_lines, 1):
            for pattern, message, severity in quality_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    suggestions.append(Suggestion(
                        type="best-practice",
                        severity=severity,
                        line=i,
                        message=message,
                        suggestion=f"Improve code quality on line {i}"
                    ))
        
        # Adjust scores based on issue context
        if request.issue_context:
            issue_title = request.issue_context.title.lower()
            
            # Validation-related issues
            if any(word in issue_title for word in ['validation', 'validate', 'input']):
                if 'validation' not in request.code.lower():
                    suggestions.append(Suggestion(
                        type="best-practice",
                        severity="high",
                        line=1,
                        message="Missing input validation for the issue requirements",
                        suggestion="Add comprehensive input validation as specified in the GitHub issue"
                    ))
                    analysis_scores['security'] -= 15
            
            # Performance-related issues
            if any(word in issue_title for word in ['performance', 'optimize', 'slow']):
                if not any(word in request.code.lower() for word in ['cache', 'index', 'limit']):
                    suggestions.append(Suggestion(
                        type="performance",
                        severity="high", 
                        line=1,
                        message="Performance optimization missing for the issue requirements",
                        suggestion="Implement caching, indexing, or query limits as mentioned in the issue"
                    ))
                    analysis_scores['performance'] -= 20
        
        # Language-specific checks
        if request.language == 'python':
            python_patterns = [
                (r'import\s+\*', "Avoid wildcard imports", "medium"),
                (r'except\s*:', "Use specific exception handling", "medium"),
                (r'global\s+\w+', "Minimize global variable usage", "low")
            ]
            
            for i, line in enumerate(code_lines, 1):
                for pattern, message, severity in python_patterns:
                    if re.search(pattern, line, re.IGNORECASE):
                        suggestions.append(Suggestion(
                            type="best-practice",
                            severity=severity,
                            line=i,
                            message=message,
                            suggestion=f"Improve Python code on line {i}"
                        ))
        
        elif request.language == 'javascript':
            js_patterns = [
                (r'function.*\{[^}]*\}', "Consider using arrow functions for concise syntax", "low"),
                (r'\.forEach\s*\(', "Consider using .map() or .filter() for functional programming", "low")
            ]
            
            for i, line in enumerate(code_lines, 1):
                for pattern, message, severity in js_patterns:
                    if re.search(pattern, line, re.IGNORECASE):
                        suggestions.append(Suggestion(
                            type="best-practice",
                            severity=severity,
                            line=i,
                            message=message,
                            suggestion=f"Modernize JavaScript on line {i}"
                        ))
        
        # Calculate overall score
        high_severity_count = len([s for s in suggestions if s.severity == "high"])
        medium_severity_count = len([s for s in suggestions if s.severity == "medium"])
        low_severity_count = len([s for s in suggestions if s.severity == "low"])
        
        # Penalize based on severity
        score_penalty = (high_severity_count * 15) + (medium_severity_count * 8) + (low_severity_count * 3)
        overall_score = max(20, 100 - score_penalty)
        
        # Adjust individual analysis scores
        for key in analysis_scores:
            analysis_scores[key] = max(20, analysis_scores[key] - (score_penalty // 4))
        
        # Generate summary
        if overall_score >= 80:
            summary = "Excellent code quality! Minor improvements suggested."
        elif overall_score >= 60:
            summary = "Good code structure with some areas for improvement."
        else:
            summary = "Code needs significant improvements for production readiness."
        
        if request.issue_context:
            summary += f" Review addresses: {request.issue_context.title}"
        
        return CodeReviewResponse(
            score=overall_score,
            analysis=CodeAnalysis(**analysis_scores),
            suggestions=suggestions[:10],  # Limit to top 10 suggestions
            summary=summary
        )
        
    except Exception as e:
        logger.error(f"Code review error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Code review failed: {str(e)}")

@router.post("/explain-code")
async def explain_code(request: dict):
    """
    Explain code functionality with context
    """
    try:
        code = request.get('code', '')
        language = request.get('language', 'javascript')
        
        # Simple code explanation (in production, use Gemini AI)
        explanation = f"""
        This {language} code appears to:
        
        1. Define functions and variables
        2. Implement the requested functionality
        3. Handle potential edge cases
        
        Key components:
        - Function declarations and implementations
        - Variable assignments and data manipulation
        - Control flow and logic structures
        
        The code structure follows {language} best practices for readability and maintainability.
        """
        
        return {
            "explanation": explanation,
            "complexity": "Medium",
            "suggestions": [
                "Add comprehensive comments for better documentation",
                "Consider error handling for edge cases",
                "Validate input parameters"
            ]
        }
        
    except Exception as e:
        logger.error(f"Code explanation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Code explanation failed: {str(e)}")

@router.post("/hint")
async def get_hint(request: dict):
    """
    Provide coding hints for GitHub issues
    """
    try:
        issue_title = request.get('issue_title', '')
        language = request.get('language', 'javascript')
        current_code = request.get('current_code', '')
        
        # Generate contextual hints
        hints = []
        
        if 'validation' in issue_title.lower():
            hints.extend([
                "Start by identifying all input fields that need validation",
                "Check for email format using regex or validation libraries",
                "Implement required field checks with clear error messages",
                "Add password strength validation (length, complexity)",
                "Return validation results in a structured format"
            ])
        elif 'performance' in issue_title.lower():
            hints.extend([
                "Identify the slow database queries or operations",
                "Add appropriate database indexes for frequently queried fields", 
                "Implement pagination to limit result sets",
                "Use query limits and WHERE clauses effectively",
                "Consider caching frequently accessed data"
            ])
        elif 'bug' in issue_title.lower():
            hints.extend([
                "Reproduce the bug scenario first",
                "Add proper error handling and validation",
                "Check for edge cases and null/undefined values",
                "Add logging to help debug the issue",
                "Write tests to prevent regression"
            ])
        else:
            hints.extend([
                f"Break down the problem into smaller {language} functions",
                "Follow the repository's coding standards and conventions",
                "Add proper error handling and input validation",
                "Include comprehensive comments and documentation",
                "Test your solution with different input scenarios"
            ])
        
        return {
            "hints": hints[:5],  # Return top 5 hints
            "next_steps": [
                "Read the issue description carefully",
                "Check the repository's existing code structure", 
                "Start with a simple implementation",
                "Test thoroughly before submitting"
            ]
        }
        
    except Exception as e:
        logger.error(f"Hint generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Hint generation failed: {str(e)}")