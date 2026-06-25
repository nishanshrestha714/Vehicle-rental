import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <>
      <Spinner
        animation="border"
        style={{
          height: "100px",
          width: "100px",
          margin: "auto",
          dispaly: "bolck",
          color:'blue'
        }}
      ></Spinner>
    </>
  );
}

export default Loader;
