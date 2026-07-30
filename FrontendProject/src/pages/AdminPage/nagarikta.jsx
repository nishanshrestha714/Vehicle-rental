import { Table, Badge, Button, Image } from "react-bootstrap";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { Link } from "react-router";
import { useGetAllNagariktaQuery } from "../../Slices/NagariktaApiSlice";
// import NavLink from "react-bootstrap";
// import { useNavigate } from "react-router";
import AdminNagariktaSearch from "./components/NagariktaSearch";


function Nagarikta() {
  const { data, isLoading, error, } = useGetAllNagariktaQuery();
  const nagarikta = data?.nagariktaget || [];
  // const navigate = useNavigate();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorMessage variant="danger">
        {error?.data?.message || error.error}
      </ErrorMessage>
    );

    const verifyHandler = async ()=>{
      // const res = 
// navigate("/nagarikta/" +res.)
  // navigate("/orders/" + res.orderId);

    }

  return (
    
    <div className="table-responsive">
   <AdminNagariktaSearch/>

      <Table hover striped bordered className="align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Full Name</th>
            <th>Nagarikta No.</th>
            <th>issue-District</th>
            <th>Date of Birth</th>
            <th>Issue Date</th>
            <th> issue-Address</th>
            <th>Images</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {nagarikta.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-4 text-muted">
                No Nagarikta records found
              </td>
            </tr>
          ) : (
            nagarikta.map((item) => (
              <tr key={item._id}>
                {/* User Object */}
                <td>
                  <div className="fw-medium">
                    {/* {item.user
                      ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
                      : "-"} */}
                  </div>
                  <small className="text-muted d-block">
                    {item.user?.email || "-"}
                  </small>
                  <small className="text-muted">
                    {item.user?.phoneNumber || "-"}
                  </small>
                </td>

                {/* Full Name */}
                <td>{item.fullName || "-"}</td>

                {/* Nagarikta Number */}
                <td>
                  <code>{item.nagariktaNumber || "-"}</code>
                </td>

                {/* District */}
                <td className="text-capitalize">
                  {item.issueDistrict || "-"}
                </td>

                {/* Date of Birth */}
                <td>
                  {item.dateofBirth
                    ? new Date(item.dateofBirth).toLocaleDateString("en-NP")
                    : "-"}
                </td>

                {/* Issue Date */}
                <td>
                  {item.issueDate
                    ? new Date(item.issueDate).toLocaleDateString("en-NP")
                    : "-"}
                </td>

                {/* Permanent Address */}
                <td className="text-capitalize">
                  {item.permentAddress || "-"}
                </td>

                {/* Front & Back Images */}
                <td>
                  <div className="d-flex gap-2">
                    {item.frontImage && (
                      <a
                        href={item.frontImage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={item.frontImage}
                          alt="Front"
                          width={70}
                          height={55}
                          rounded
                          style={{ objectFit: "cover" }}
                        />
                      </a>
                    )}
                    {item.backImage && (
                      <a
                        href={item.backImage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={item.backImage}
                          alt="Back"
                           width={70}
                          height={55}
                          rounded
                          style={{ objectFit: "cover" }}
                        />
                      </a>
                    )}
                  </div>
                </td>

                {/* Verified Status */}
                <td>
                  <Badge bg={item.verified ? "success" : "danger"}>
                    {item.verified ? "Verified" : "not-verified"}
                  </Badge>
                </td>

                {/* Actions */}
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      as={Link}
                      onClick={verifyHandler}
                      to={`/admin/nagarikta/${item._id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      verified-Btn
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Nagarikta;