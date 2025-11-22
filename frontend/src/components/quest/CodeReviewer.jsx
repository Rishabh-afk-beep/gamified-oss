import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  LightBulbIcon,
  ChatBubbleBottomCenterIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const CodeReviewer = ({ code, language = 'javascript', questContext, onReviewComplete }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [review, setReview] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleReview = async () => {
    if (!code || !code.trim()) {
      alert('Please write some code first!');
      return;
    }

    setIsReviewing(true);
    try {
      const result = await aiService.reviewCode(code, language, questContext);
      setReview(result);
      
      if (onReviewComplete) {
        onReviewComplete(result);
      }
    } catch (error) {
      console.error('Review failed:', error);
      setReview({
        success: false,
        is_correct: false,
        feedback: `Review failed: ${error.message}`,
        suggestions: ['Try again', 'Check your internet connection']
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const handleGetHint = async () => {
    try {
      const hintResult = await aiService.getQuestHint(
        questContext?.id || 'unknown',
        questContext,
        code
      );
      
      if (hintResult.success) {
        // You can display this in a modal or add to review feedback
        alert(`💡 Hint: ${hintResult.hint}`);
      }
    } catch (error) {
      console.error('Hint failed:', error);
      alert('Could not get hint. Try the chat feature!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <CodeBracketIcon className="w-5 h-5 text-blue-500" />
          AI Code Review
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={handleGetHint}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            disabled={isReviewing}
          >
            <LightBulbIcon className="w-4 h-4" />
            Get Hint
          </button>
          
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <ChatBubbleBottomCenterIcon className="w-4 h-4" />
            AI Chat
          </button>
        </div>
      </div>

      <button
        onClick={handleReview}
        disabled={isReviewing || !code?.trim()}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          isReviewing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isReviewing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            Reviewing Code...
          </div>
        ) : (
          'Submit for AI Review'
        )}
      </button>

      {review && (
        <div className={`border-l-4 p-4 rounded-r-lg ${
          review.is_correct 
            ? 'border-green-500 bg-green-50' 
            : 'border-red-500 bg-red-50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {review.is_correct ? (
              <>
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">✅ Code Approved!</span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">❌ Needs Improvement</span>
              </>
            )}
            
            {review.score && (
              <span className="ml-auto text-sm font-medium text-gray-600">
                Score: {review.score}/10
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Feedback:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{review.feedback}</p>
            </div>

            {review.suggestions && review.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {review.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">AI Assistant</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* You can embed your existing Chatbot component here */}
            <p className="text-gray-600">
              💬 Chat feature would be embedded here. 
              You can import your existing Chatbot component and pass questContext as props.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeReviewer;
