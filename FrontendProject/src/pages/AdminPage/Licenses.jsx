import { useState } from "react";
import { Link } from "react-router";
import {
  Table,
  Badge,
  Button,
  Image,
  Form,
  InputGroup,
} from "react-bootstrap";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { useGetLicenseQuery } from "../../Slices/LicenseApiSlices";

function Licenses() {
  const { data, isLoading, error, refetch } = useGetLicenseQuery();
  const [search, setSearch] = useState("");

  const licenses = data?.License || [];

  const filtered = licenses.filter((lic) => {
    const term = search.toLowerCase();
    return (
      lic.licesneNumber?.toLowerCase().includes(term) ||
      lic.fullname?.toLowerCase().includes(term) ||
      lic.user?.firstName?.toLowerCase().includes(term) ||
      lic.user?.lastName?.toLowerCase().includes(term) ||
      lic.user?.email?.toLowerCase().includes(term) ||
      lic.nagariktaNumber?.toLowerCase().includes(term)
    );
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="w-100 px-3 px-md-4 my-5">
        <ErrorMessage variant="danger">
          {error?.data?.error || error?.data?.message || error.error}
        </ErrorMessage>
        <Button variant="outline-secondary" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-100 px-3 px-md-4 my-4">
      {/* Header + Search */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="mb-1">License Verification List</h4>
          <small className="text-muted">
            {licenses.length} total license{licenses.length !== 1 ? "s" : ""}
          </small>
        </div>

        <InputGroup style={{ maxWidth: 340 }}>
          <Form.Control
            type="text"
            placeholder="Search by name, number, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Full width table */}
      <div className="table-responsive w-100">
        <Table
          hover
          striped
          bordered
          className="align-middle mb-0 bg-white shadow-sm w-100"
        >
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Full Name</th>
              <th>License No.</th>
              <th>Category</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Address</th>
              <th>Nagarikta No.</th>
              <th>Image</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-muted">
                  {licenses.length === 0
                    ? "No License records found"
                    : "No licenses match your search"}
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id}>
                  {/* User */}
                  <td>
                    <div className="fw-medium">
                      {item.user
                        ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
                        : "-"}
                    </div>
                    <small className="text-muted d-block">
                      {item.user?.email || "-"}
                    </small>
                    <small className="text-muted">
                      {item.user?.phoneNumber || "-"}
                    </small>
                  </td>

                  {/* Full Name */}
                  <td>{item.fullname || "-"}</td>

                  {/* License Number */}
                  <td>
                    <code>{item.licesneNumber || "-"}</code>
                  </td>

                  {/* Category */}
                  <td>
                    <Badge bg="info">{item.cotegory || "-"}</Badge>
                  </td>

                  {/* Issue Date */}
                  <td>
                    {item.issueDate
                      ? new Date(item.issueDate).toLocaleDateString("en-NP")
                      : "-"}
                  </td>

                  {/* Expiry Date */}
                  <td>
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString("en-NP")
                      : "-"}
                  </td>

                  {/* Address */}
                  <td className="text-capitalize">{item.address || "-"}</td>

                  {/* Nagarikta Number */}
                  <td>
                    <code>{item.nagariktaNumber || "-"}</code>
                  </td>

                  {/* Image */}
                  <td>
                    {item.image ? (
                      <a
                        href={item.image}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={item.image}
                          alt="License"
                          width={70}
                          height={50}
                          rounded
                          style={{ objectFit: "cover" }}
                        />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Verified */}
                  <td>
                    <Badge bg={item.verified ? "success" : "danger"}>
                      {item.verified ? "Verified" : "Not Verified"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/license/${item._id}/verify`}
                      variant={
                        item.verified ? "outline-success" : "outline-primary"
                      }
                      size="sm"
                    >
                      {item.verified ? "View" : "Review & Verify"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Licenses;