import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--cream)] selection:bg-[var(--accent-light)] selection:text-[var(--accent)]">
      <Navbar />
      {children}

      {/* SDG 17-colour rainbow strip pinned to the bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[90] h-[4px]"
        style={{
          background: 'linear-gradient(90deg,#e5243b 0%,#dda63a 6.5%,#4c9f38 12%,#c5192d 18%,#ff3a21 23.5%,#26bde2 29%,#fcc30b 35%,#a21942 41%,#fd6925 47%,#dd1367 53%,#fd9d24 59%,#bf8b2e 65%,#3f7e44 71%,#0a97d9 77%,#56c02b 83%,#00689d 89%,#19486a 100%)',
        }}
      />
    </div>
  );
};

export default MainLayout;
