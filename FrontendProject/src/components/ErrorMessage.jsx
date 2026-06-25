import { Alert } from "react-bootstrap";

function ErrorMessage ({type="danger" , children}){
    return (
        <>
         <Alert variant={type} > {children}</Alert>
        </>
    )

};

export default ErrorMessage;
