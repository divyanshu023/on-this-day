import * as React from "react";

const App = () => {
  return (
    <div
    css={{
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'lightgreen'
      }
    }}
  >
      My App Component
    </div>
  );
}

export default App
