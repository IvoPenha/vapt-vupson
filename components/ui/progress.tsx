'use client'; 

const linerUncontrolledProgress = () => (
  <div className="h-2 bg-gray-200 rounded overflow-hidden">
    <div className="h-full bg-primary-500 animate-loading"></div>
  </div>
);
 
export {linerUncontrolledProgress as Progress };
