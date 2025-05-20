import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import Link from 'next/link';

// Define the Agent type based on Prisma schema
// This assumes your prisma client is generated in '@generated/prisma'
// Adjust the import path if your generated client is elsewhere.
type Agent = Prisma.AgentGetPayload<{}>;

// Asynchronously fetches agents from the database
async function fetchAgents(): Promise<Agent[]> {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: {
        name: 'asc', // Orders agents by name in ascending order
      },
    });
    return agents;
  } catch (error) {
    console.error("Failed to fetch agents: ", error);
    return []; // Returns an empty array in case of an error
  }
}

// The main page component for displaying agents
export default async function AgentsPage() {
  const agents = await fetchAgents();

  return (
    <div>
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Header section with title and action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Your Agents</h1>
          {/* Container for the new agent creation buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/agents/new?type=email" // Link to create a new email agent
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-blue-100 font-medium py-2.5 px-5 rounded-lg shadow-md
                         transition duration-150 ease-in-out transform hover:scale-105 whitespace-nowrap w-full sm:w-auto text-center"
            >
              + Create New Email Agent
            </Link>
            <Link
              href="/agents/new?type=phone" // Link to create a new phone agent
              className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:text-green-100 font-medium py-2.5 px-5 rounded-lg shadow-md
                         transition duration-150 ease-in-out transform hover:scale-105 whitespace-nowrap w-full sm:w-auto text-center"
            >
              + Create New Phone Agent
            </Link>
          </div>
        </div>

        {/* Conditional rendering based on whether agents exist */}
        {agents.length === 0 ? (
          // Displayed when no agents are found
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-700 dark:text-gray-200">No agents found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new agent.</p>
            {/* Buttons for creating new agents in the empty state */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 px-4">
              <Link
                href="/agents/new?type=email"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                Create New Email Agent
              </Link>
              <Link
                href="/agents/new?type=phone"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-700 dark:hover:bg-green-600 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
              >
                Create New Phone Agent
              </Link>
            </div>
          </div>
        ) : (
          // Displayed when agents exist, showing a grid of agent cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col
                           transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-500"
              >
                <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-3 truncate" title={agent.name}>
                  {agent.name}
                </h2>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Main Prompt:</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-28 overflow-y-auto
                                 whitespace-pre-wrap break-words scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                                 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {agent.prompt}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
                  <Link
                    href={`/agents/${agent.id}/edit`} // Link to edit an existing agent
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    Edit Agent
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
