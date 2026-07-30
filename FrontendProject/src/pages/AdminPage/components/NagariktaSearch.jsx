import { useState } from "react";
import { useSearchNagariktaQuery } from "../../../Slices/NagariktaApiSlice";
import { Button } from "react-bootstrap";

function AdminNagariktaSearch() {
  const [searchNumber, setSearchNumber] = useState("");
  const [submittedNumber, setSubmittedNumber] = useState("");

  const { data, isLoading, isError, error } =  useSearchNagariktaQuery (
    submittedNumber,
    { skip: !submittedNumber },
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedNumber(searchNumber);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
        <input
          type="text"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          placeholder="e.g. 12-34-56-78901"
        />
        <Button  className="bg-primary " type="submit">Search</Button>
      </form>

      {isLoading && <p>Searching...</p>}
      {isError && <p>{error?.data?.error || "No record found"}</p>}
      {data && (
        <div>
          <p>Name: {data.fullName}</p>
          <p>Number: {data.nagariktaNumber}</p>
          <p>User: {data.user?.firstName} {data.user?.lastName}</p>
          <p>Verified: {data.verified ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}

export default AdminNagariktaSearch;