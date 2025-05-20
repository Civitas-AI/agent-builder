'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Define the interface for route details
interface RouteDetail {
  route: string;
  prompt: string;
}

export default function NewAgentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams?.get('type') || 'email'; // Default to email if no type specified
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [routeDetails, setRouteDetails] = useState<RouteDetail[]>([]);
  
  // Color scheme based on agent type
  const colorScheme = agentType === 'email' 
    ? {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
        border: 'border-blue-400',
        text: 'text-blue-600 hover:text-blue-800',
        ring: 'focus:ring-blue-500'
      }
    : {
        primary: 'bg-green-600 hover:bg-green-700 text-white',
        secondary: 'bg-green-100 hover:bg-green-200 text-green-700',
        border: 'border-green-400',
        text: 'text-green-600 hover:text-green-800',
        ring: 'focus:ring-green-500'
      };
  
  // Set initial title based on agent type
  useEffect(() => {
    if (agentType === 'email') {
      setName('Email Agent');
    } else if (agentType === 'phone') {
      setName('Phone Agent');
    }
  }, [agentType]);
  
  // Add a new empty route detail
  const addRouteDetail = () => {
    setRouteDetails([...routeDetails, { route: '', prompt: '' }]);
  };
  
  // Remove a route detail at a specific index
  const removeRouteDetail = (index: number) => {
    const newRouteDetails = [...routeDetails];
    newRouteDetails.splice(index, 1);
    setRouteDetails(newRouteDetails);
  };
  
  // Update a route detail at a specific index
  const updateRouteDetail = (index: number, field: keyof RouteDetail, value: string) => {
    const newRouteDetails = [...routeDetails];
    newRouteDetails[index][field] = value;
    setRouteDetails(newRouteDetails);
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setError('Agent name is required');
      return;
    }
    
    if (!prompt.trim()) {
      setError('Main prompt is required');
      return;
    }
    
    // Validate route details if any exist
    for (let i = 0; i < routeDetails.length; i++) {
      if (!routeDetails[i].route.trim()) {
        setError(`Route is required for route detail #${i + 1}`);
        return;
      }
      if (!routeDetails[i].prompt.trim()) {
        setError(`Prompt is required for route detail #${i + 1}`);
        return;
      }
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send the data to your API endpoint
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          prompt,
          routeDetails,
          type: agentType, // Include the agent type in the request
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create agent');
      }
      
      // Redirect to the agents listing page on success
      router.push('/agents');
      router.refresh(); // Refresh the page data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <Link 
          href="/agents" 
          className={`${colorScheme.text} flex items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Agents
        </Link>
      </div>
      
      <div className={`bg-white rounded-xl shadow-lg border ${colorScheme.border} p-6 md:p-8`}>
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Create New {agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Agent Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${colorScheme.ring}`}
              placeholder={`Enter ${agentType} agent name`}
              required
            />
          </div>
          
          {/* Main Prompt */}
          <div className="mb-8">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Main Prompt *
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${colorScheme.ring} h-32`}
              placeholder={`Enter the main prompt for this ${agentType} agent`}
              required
            />
          </div>
          
          {/* Route Details Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800">Route Details</h2>
              <button
                type="button"
                onClick={addRouteDetail}
                className={`${colorScheme.secondary} px-4 py-2 rounded-md flex items-center text-sm font-medium`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Route Detail
              </button>
            </div>
            
            {routeDetails.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No route details added yet. Click "Add Route Detail" to add one.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {routeDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gray-700">Route Detail #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeRouteDetail(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Route *
                        </label>
                        <input
                          type="text"
                          value={detail.route}
                          onChange={(e) => updateRouteDetail(index, 'route', e.target.value)}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${colorScheme.ring}`}
                          placeholder="/api/example-route"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prompt *
                        </label>
                        <textarea
                          value={detail.prompt}
                          onChange={(e) => updateRouteDetail(index, 'prompt', e.target.value)}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${colorScheme.ring} h-24`}
                          placeholder="Enter the prompt for this route"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link
              href="/agents"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 ${colorScheme.primary} rounded-lg shadow-md transition-colors duration-200 flex items-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                `Create ${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}