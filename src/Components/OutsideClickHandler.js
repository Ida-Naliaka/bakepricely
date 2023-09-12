import React, { useRef, useEffect } from 'react';

function OutsideClickHandler(props) {
    
    
    //Finally, we return the JSX content, wrapping it in a <div> with the wrapperRef reference.
    // use this functional component in your application and provide an onOutsideClick callback as a prop to handle outside click events.
    //doesnt work with popovers
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
        //wrapperRef reference used to check if a click occurs outside the component's content.
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        props.onOutsideClick(event);
      }
    }
    //add an event listener for the mousedown event on the document. 
    //This checks if the click occurred outside the component's wrapperRef. 
    //If it did, it calls the props.onOutsideClick function (adjust the callback name as needed).
    document.addEventListener('mousedown', handleClickOutside);

    return () =>{
        //In the useEffect cleanup function, remove the event listener to prevent memory leaks when the component unmounts.
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props]);

  return (
    <div ref={wrapperRef}>
      {props.children}
    </div>
  );
}

export default OutsideClickHandler;
