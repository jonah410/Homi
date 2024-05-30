import React from 'react';
import '../../styles/main.css';

const TaskGrid = () => {
  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h2>Easy Task</h2>
          <p>Description of the easy task.</p>
        </div>
        <div className="card">
          <h2>Medium Task</h2>
          <p>Description of the medium task.</p>
        </div>
        <div className="card">
          <h2>Hard Task</h2>
          <p>Description of the hard task.</p>
        </div>
      </div>
    </div>
  );
};

export default TaskGrid;
