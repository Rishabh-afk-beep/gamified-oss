"""
AI Chat Service - Powered by Google Gemini
Handles AI conversations, code explanations, and hints
"""

import os
import json
from datetime import datetime
import google.generativeai as genai
from app.core.config import settings

# Configure Gemini API with error handling
try:
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        print(f"✅ Gemini configured with API key")
    else:
        print("❌ GEMINI_API_KEY not found in settings")
except Exception as e:
    print(f"❌ Failed to configure Gemini: {e}")

class AIService:
    """Handle AI chat interactions using Google Gemini"""
    
    def __init__(self):
        """Initialize AI service with Gemini model"""
        self.model_name = settings.GEMINI_MODEL
        self.max_tokens = settings.GEMINI_MAX_TOKENS
        self.temperature = settings.GEMINI_TEMPERATURE
        self.api_key = settings.GEMINI_API_KEY
        
        # Validate API key
        if not self.api_key or self.api_key == "your_actual_gemini_api_key_here":
            print("❌ Invalid or missing GEMINI_API_KEY")
            self.model = None
            return
        
        # Initialize the model with fallback options
        models_to_try = [
            "gemini-2.5-flash-lite",
            "gemini-2.5-flash", 
            "gemini-flash-lite-latest",
            "gemini-flash-latest",
            "gemini-2.0-flash-lite",
            "gemini-2.0-flash"
        ]
        
        self.model = None
        for model_name in models_to_try:
            try:
                self.model = genai.GenerativeModel(model_name)
                self.model_name = model_name
                print(f"✅ Gemini AI Service initialized with model: {model_name}")
                break
            except Exception as e:
                print(f"⚠️  Failed to load {model_name}: {e}")
                continue
        
        if not self.model:
            print("❌ Critical: No Gemini model could be loaded")
        
        # Store conversation history
        self.conversation_history = []
    
    async def chat(self, user_message: str, user_id: str, context: str = "") -> dict:
        """
        Chat with AI assistant using Gemini
        
        Args:
            user_message (str): The user's question/message
            user_id (str): ID of the user asking
            context (str): Additional context (topic, problem details)
        
        Returns:
            dict: Response from AI
        """
        # Validate inputs
        if not user_message or not user_message.strip():
            return {
                "success": False,
                "response": "Please provide a valid message.",
                "error": "Empty or invalid message",
                "user_id": user_id
            }
        
        if not self.model:
            return {
                "success": False,
                "response": "AI service is currently unavailable. Please check the configuration.",
                "error": "Model not initialized - check GEMINI_API_KEY",
                "user_id": user_id
            }
        
        try:
            # Build the system prompt
            system_prompt = """You are CodeQuest AI Assistant, a friendly and helpful coding tutor for a gamified learning platform.

Your responsibilities:
1. Answer programming questions clearly and concisely
2. Explain code concepts in simple terms  
3. Provide hints (NOT full solutions) for coding problems
4. Encourage learning and problem-solving skills
5. Be supportive and encouraging
6. Format code examples with triple backticks
7. Keep responses under 400 words
8. Use emojis to make responses engaging

Teaching Philosophy:
- Help users understand concepts, don't give answers
- Guide them to discover solutions
- Celebrate their learning journey
- Make programming fun and accessible"""
            
            # Add context if provided
            if context and context.strip():
                system_prompt += f"\n\nCurrent Context: {context}"
            
            # Create the full prompt
            full_prompt = f"{system_prompt}\n\nUser Question: {user_message}\n\nPlease provide a helpful, educational response:"
            
            # Generate response using Gemini with retry logic
            max_retries = 2
            ai_response = None
            
            for attempt in range(max_retries):
                try:
                    response = self.model.generate_content(
                        full_prompt,
                        generation_config=genai.types.GenerationConfig(
                            max_output_tokens=min(self.max_tokens, 800),
                            temperature=self.temperature,
                        )
                    )
                    
                    # Extract and validate the AI response
                    if response and response.text:
                        ai_response = response.text.strip()
                        if ai_response:  # Make sure it's not empty
                            break
                    
                    # If we get here, response was empty
                    if attempt < max_retries - 1:
                        print(f"⚠️  Empty response on attempt {attempt + 1}, retrying...")
                        continue
                    else:
                        ai_response = "I'm having trouble generating a response right now. Could you try rephrasing your question? 🤔"
                        break
                        
                except Exception as e:
                    if attempt < max_retries - 1:
                        print(f"⚠️  Retry attempt {attempt + 1} for user {user_id}: {str(e)}")
                        continue
                    else:
                        raise e
            
            # Fallback if no response generated
            if not ai_response:
                ai_response = "I'm having difficulty generating a response. Please try again! 😊"
            
            # Estimate tokens (rough calculation)
            tokens_used = len(user_message.split()) + len(ai_response.split())
            
            # Add to conversation history
            self.conversation_history.append({
                "role": "user",
                "content": user_message,
                "timestamp": datetime.utcnow().isoformat()
            })
            self.conversation_history.append({
                "role": "assistant", 
                "content": ai_response,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Keep only last 10 exchanges (20 messages)
            if len(self.conversation_history) > 20:
                self.conversation_history = self.conversation_history[-20:]
            
            return {
                "success": True,
                "response": ai_response,
                "timestamp": datetime.utcnow().isoformat(),
                "tokens_used": tokens_used,
                "user_id": user_id,
                "model": self.model_name
            }
        
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error in AI chat for user {user_id}: {error_msg}")
            
            # Return user-friendly error message based on error type
            if "quota" in error_msg.lower() or "429" in error_msg:
                user_error = "I'm currently experiencing high demand. Please try again in a few minutes! 😊"
            elif "authentication" in error_msg.lower() or "403" in error_msg:
                user_error = "There's a temporary authentication issue. The admin has been notified! 🔧"
            elif "400" in error_msg or "invalid" in error_msg.lower():
                user_error = "I couldn't process your request. Could you try rephrasing your question? 🤔"
            else:
                user_error = "I'm having a quick technical hiccup. Please try again! 🛠️"
            
            return {
                "success": False,
                "response": user_error,
                "error": error_msg,
                "user_id": user_id,
                "model": self.model_name if hasattr(self, 'model_name') else 'unknown'
            }
    
    async def get_code_explanation(self, code: str, language: str = "python") -> str:
        """
        Explain a code snippet
        
        Args:
            code (str): The code to explain
            language (str): Programming language
        
        Returns:
            str: Explanation of the code
        """
        try:
            prompt = f"""Explain this {language} code in simple terms:


Please provide:
1. **What it does**: Brief description of the overall purpose
2. **How it works**: Step-by-step explanation of the logic
3. **Key concepts**: Important programming concepts used
4. **Example**: Show how it would work with sample input/output

Keep it concise and easy to understand for beginners."""
            
            response = self.model.generate_content(prompt)
            return response.text
        
        except Exception as e:
            print(f"❌ Error explaining code: {str(e)}")
            return f"Error explaining code: {str(e)}"
    
    async def generate_hint(self, problem_title: str, problem_description: str, difficulty: str = "beginner") -> str:
        """
        Generate a helpful hint for a coding problem
        
        Args:
            problem_title (str): Title of the problem
            problem_description (str): Full description of the problem
            difficulty (str): Difficulty level
        
        Returns:
            str: A helpful hint that doesn't give away the answer
        """
        try:
            difficulty_guidance = {
                "beginner": "Give a very basic hint about the approach",
                "intermediate": "Mention the algorithm type but not specific implementation",
                "advanced": "Suggest optimization techniques"
            }
            
            guidance = difficulty_guidance.get(difficulty, "Give a helpful hint")
            
            prompt = f"""Generate a helpful hint for this {difficulty} coding problem.
{guidance}

IMPORTANT: Do NOT give the full solution or code!

Problem Title: {problem_title}
Problem Description: {problem_description}

Provide:
1. A hint about the approach to solve it
2. Key concepts to think about
3. A question to guide their thinking
4. One small example if helpful

Keep the hint encouraging and educational."""
            
            response = self.model.generate_content(prompt)
            return response.text
        
        except Exception as e:
            print(f"❌ Error generating hint: {str(e)}")
            return f"Error generating hint: {str(e)}"
    
    async def debug_code(self, code: str, error: str, language: str = "python") -> str:
        """
        Help debug code by explaining the error
        
        Args:
            code (str): The buggy code
            error (str): The error message
            language (str): Programming language
        
        Returns:
            str: Debugging advice
        """
        try:
            prompt = f"""Help debug this {language} code:


Error: {error}

Please:
1. Explain what went wrong
2. Identify the root cause
3. Suggest how to fix it
4. Show corrected code
5. Explain how to prevent this error

Keep it educational and constructive."""
            
            response = self.model.generate_content(prompt)
            return response.text
        
        except Exception as e:
            print(f"❌ Error debugging code: {str(e)}")
            return f"Error debugging: {str(e)}"
    
    async def learn_concept(self, concept: str, level: str = "beginner") -> str:
        """
        Teach a programming concept
        
        Args:
            concept (str): The concept to learn (e.g., "recursion")
            level (str): Learning level
        
        Returns:
            str: Explanation with examples
        """
        try:
            prompt = f"""Teach me about {concept} at the {level} level.

Please include:
1. **Simple Definition**: What is {concept}?
2. **Why It Matters**: When and why use {concept}?
3. **Key Points**: 3-4 important things to know
4. **Code Example**: A simple, clear code example
5. **Common Mistakes**: Things beginners often get wrong
6. **Practice Tip**: How to practice this concept

Make it engaging, clear, and not overwhelming."""
            
            response = self.model.generate_content(prompt)
            return response.text
        
        except Exception as e:
            print(f"❌ Error explaining concept: {str(e)}")
            return f"Error explaining concept: {str(e)}"
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
        print("✅ Conversation history cleared")
    
    def get_history(self) -> list:
        """Get conversation history"""
        return self.conversation_history
    
    async def review_code(self, code: str, language: str, quest_context: dict = None) -> dict:
        """
        Review code and determine if it's correct based on quest requirements
        
        Args:
            code (str): The code to review
            language (str): Programming language
            quest_context (dict): Quest details and requirements
        
        Returns:
            dict: Review result with correctness assessment
        """
        if not self.model:
            return {
                "success": False,
                "is_correct": False,
                "feedback": "AI code review is currently unavailable.",
                "suggestions": [],
                "error": "Model not initialized"
            }
        
        try:
            # Build context-aware review prompt
            if quest_context:
                review_prompt = f"""You are a CodeQuest AI Code Reviewer. Your job is to review code submissions for coding quests and determine if they meet the requirements.

Quest Information:
- Title: {quest_context.get('title', 'Code Challenge')}
- Description: {quest_context.get('description', 'Not provided')}
- Requirements: {quest_context.get('requirements', 'Check if code works correctly')}
- Difficulty: {quest_context.get('difficulty', 'beginner')}

Code to Review ({language}):
```{language}
{code}
```

Please provide a comprehensive review with:
1. **CORRECTNESS**: Does this code meet the quest requirements? (YES/NO)
2. **FUNCTIONALITY**: Does the code work as expected?
3. **CODE QUALITY**: Is the code well-written and following best practices?
4. **IMPROVEMENTS**: Specific suggestions for improvement
5. **ENCOURAGEMENT**: Positive feedback and next steps

Format your response as:
CORRECTNESS: [YES/NO]
SCORE: [1-10]
FEEDBACK: [Your detailed feedback]
SUGGESTIONS: [Bullet points of improvements]"""
            else:
                review_prompt = f"""You are a CodeQuest AI Code Reviewer. Review this {language} code and provide constructive feedback.

Code to Review:
```{language}
{code}
```

Assess:
1. **CORRECTNESS**: Does the code work as intended? (YES/NO)
2. **QUALITY**: Code structure, readability, best practices
3. **IMPROVEMENTS**: Specific suggestions

Format your response as:
CORRECTNESS: [YES/NO]
SCORE: [1-10]
FEEDBACK: [Your detailed feedback]
SUGGESTIONS: [Bullet points of improvements]"""

            # Generate review
            response = self.model.generate_content(
                review_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=min(self.max_tokens, 1000),
                    temperature=0.3,  # Lower temperature for more consistent reviews
                )
            )
            
            if not response or not response.text:
                raise Exception("Empty response from AI reviewer")
            
            review_text = response.text.strip()
            
            # Parse the review response
            is_correct = "YES" in review_text.split("CORRECTNESS:")[1].split("\n")[0].upper() if "CORRECTNESS:" in review_text else False
            
            # Extract score
            score = 5  # default
            if "SCORE:" in review_text:
                try:
                    score_text = review_text.split("SCORE:")[1].split("\n")[0].strip()
                    score = int(score_text.split("/")[0].strip())
                except:
                    score = 5
            
            # Extract suggestions and format them properly
            suggestions = []
            if "SUGGESTIONS:" in review_text:
                suggestions_text = review_text.split("SUGGESTIONS:")[1]
                raw_suggestions = [s.strip() for s in suggestions_text.split("*") if s.strip()]
                
                # Convert raw suggestions to structured format
                for i, suggestion_text in enumerate(raw_suggestions[:6]):  # Limit to 6 suggestions
                    if suggestion_text:
                        # Try to parse severity and type from content
                        suggestion_lower = suggestion_text.lower()
                        
                        # Determine type based on keywords
                        if any(word in suggestion_lower for word in ['performance', 'optimize', 'efficient', 'speed']):
                            suggestion_type = 'performance'
                        elif any(word in suggestion_lower for word in ['security', 'validate', 'sanitize', 'safe']):
                            suggestion_type = 'security'
                        elif any(word in suggestion_lower for word in ['bug', 'error', 'fix', 'incorrect', 'wrong']):
                            suggestion_type = 'bug'
                        else:
                            suggestion_type = 'best-practice'
                        
                        # Determine severity
                        if any(word in suggestion_lower for word in ['critical', 'serious', 'urgent', 'security']):
                            severity = 'high'
                        elif any(word in suggestion_lower for word in ['performance', 'optimize', 'improve']):
                            severity = 'medium'
                        else:
                            severity = 'low'
                        
                        suggestions.append({
                            "type": suggestion_type,
                            "severity": severity,
                            "line": None,
                            "message": suggestion_text[:100] + "..." if len(suggestion_text) > 100 else suggestion_text,
                            "suggestion": suggestion_text,
                            "corrected_code": None
                        })
            
            return {
                "success": True,
                "is_correct": is_correct,
                "score": score,
                "feedback": review_text,
                "analysis": review_text,  # Include both for compatibility
                "suggestions": suggestions,
                "language": language,
                "quest_context": quest_context.get('title') if quest_context else None,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error in code review: {error_msg}")
            
            return {
                "success": False,
                "is_correct": False,
                "feedback": "I encountered an issue while reviewing your code. Please try again or ask for help in the chat! 🔧",
                "suggestions": ["Try submitting your code again", "Use the AI chat for help if needed"],
                "error": error_msg
            }

    async def get_hint_for_quest(self, quest_context: dict, user_attempt: str = None) -> dict:
        """
        Generate a helpful hint for a specific quest
        """
        if not self.model:
            return {
                "success": False,
                "hint": "Hint service is currently unavailable.",
                "error": "Model not initialized"
            }
        
        try:
            hint_prompt = f"""You are a CodeQuest AI Tutor providing helpful hints for coding challenges.

Quest Details:
- Title: {quest_context.get('title', 'Coding Challenge')}
- Description: {quest_context.get('description', '')}
- Difficulty: {quest_context.get('difficulty', 'beginner')}

User's Current Attempt (if any):
{user_attempt if user_attempt else 'No attempt yet'}

Provide a helpful hint that:
1. Guides the user toward the solution WITHOUT giving the complete answer
2. Explains key concepts they need to understand
3. Suggests an approach or strategy
4. Encourages them to keep trying

Keep the hint encouraging and educational. Use emojis to make it friendly! 🎯"""

            response = self.model.generate_content(
                hint_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=400,
                    temperature=0.7,
                )
            )
            
            hint_text = response.text if response and response.text else "Keep experimenting and don't give up! 💪"
            
            return {
                "success": True,
                "hint": hint_text,
                "quest_title": quest_context.get('title'),
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "hint": "I'm having trouble generating a hint right now. Try breaking down the problem into smaller steps! 🔍",
                "error": str(e)
            }
