import { Alert } from "react-bootstrap";


function SuccessMessage ({ type = "info", children  , onClick }) 
{
    return (
        <>
  return <Alert variant={type} onClick={onClick}>{children} </Alert>;
      
        </>
    )
};


 export default SuccessMessage;
 