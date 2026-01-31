
import React from 'react';

const WaveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
      <svg className="absolute bottom-0 w-[200%] h-48 animate-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path 
          fill="rgba(0, 196, 255, 0.1)" 
          d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <path 
          fill="rgba(0, 196, 255, 0.05)" 
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          style={{ transform: 'translateX(-10%) translateY(20px)' }}
        ></path>
      </svg>
    </div>
  );
};

export default WaveBackground;
