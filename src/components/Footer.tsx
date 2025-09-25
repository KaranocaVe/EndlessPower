import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 z-10 shrink-0">
      <div className="space-y-2">
        <div id="visitor-stats" className="inline-block"></div>
        <p>
          <a 
            href="https://github.com/jasonmumiao/EndlessPower" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center hover:text-blue-600 transition-all duration-200 hover:scale-105"
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="currentColor" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" 
                clipRule="evenodd"
              />
            </svg>
            View Project on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
