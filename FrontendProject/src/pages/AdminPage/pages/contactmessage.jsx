import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiInbox,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
// Change from:
// import { useGetAllContactMessagesQuery, useDeleteContactMessageMutation } from "../Slices/contactApiSlice";

// To:
import { useGetAllContactMessagesQuery, useDeleteContactMessageMutation } from "../../../Slices/contactApiSlice";

function ContactMessage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // RTK Query Hooks
  const { data, isLoading, isError, error, refetch } =
    useGetAllContactMessagesQuery();
  const [deleteContactMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const messages = data?.messages || [];

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) => {
    const term = searchTerm.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(term) ||
      msg.email?.toLowerCase().includes(term) ||
      msg.phoneNumber?.includes(term) ||
      msg.message?.toLowerCase().includes(term)
    );
  });

  const handleOpenView = (msg) => {
    setSelectedMessage(msg);
    setShowViewModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteContactMessage(deleteId).unwrap();
      toast.success(res?.message || "Message deleted successfully!");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to delete message.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "2.5rem 0 4rem",
      }}
    >
      <Container>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                color: "#211c16",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}
            >
              Contact Messages
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
              Admin Portal: View and manage customer inquiries.
            </p>
          </div>
          {/* <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
            onClick={refetch}
            style={{ borderRadius: "10px" }}
          >
             <FiRefreshCw size={16} /> Refresh
          </Button> */}
        </div>

        {/* Stats Row */}
        <Row className="mb-4 g-3">
          <Col sm={6} md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: "#eef2ff", color: "#4f46e5" }}
                >
                  <FiInbox size={24} />
                </div>
                <div>
                  <div className="text-muted small">Total Messages</div>
                  <h4 className="fw-bold mb-0" style={{ color: "#211c16" }}>
                    {messages.length}
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
          <Col sm={6} md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: "#ecfdf5", color: "#059669" }}
                >
                  <FiMail size={24} />
                </div>
                <div>
                  <div className="text-muted small">Filtered Messages</div>
                  <h4 className="fw-bold mb-0" style={{ color: "#211c16" }}>
                    {filteredMessages.length}
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content Table Card */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Header
            className="bg-white border-0 p-4"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <Row className="align-items-center g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0 pe-0">
                    <FiSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, phone, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0 ps-2"
                    style={{ height: "44px", boxShadow: "none" }}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-0">
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading messages...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-5 text-danger">
                <p>{error?.data?.error || "Error loading messages."}</p>
                <Button variant="outline-danger" size="sm" onClick={refetch}>
                  Try Again
                </Button>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-5">
                <FiInbox size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No messages found</h5>
                <p className="text-muted small mb-0">
                  {searchTerm
                    ? "No records matched your search."
                    : "Submitted user messages will appear here."}
                </p>
              </div>
            ) : (
              <Table responsive hover className="align-middle mb-0">
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th className="ps-4 text-muted small fw-semibold">NAME</th>
                    <th className="text-muted small fw-semibold">CONTACT INFO</th>
                    <th className="text-muted small fw-semibold">MESSAGE PREVIEW</th>
                    <th className="text-muted small fw-semibold">DATE</th>
                    <th className="text-end pe-4 text-muted small fw-semibold">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr key={msg._id}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{msg.name}</div>
                      </td>
                      <td>
                        <div className="small text-dark d-flex align-items-center gap-1">
                          <FiMail size={13} className="text-muted" /> {msg.email}
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                          <FiPhone size={13} className="text-muted" />{" "}
                          {msg.phoneNumber}
                        </div>
                      </td>
                      <td>
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "260px", color: "#475569" }}
                        >
                          {msg.message}
                        </div>
                      </td>
                      <td className="small text-muted">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            variant="light"
                            size="sm"
                            title="View Full Message"
                            onClick={() => handleOpenView(msg)}
                          >
                            <FiEye size={16} className="text-primary" />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            title="Delete Message"
                            onClick={() => setDeleteId(msg._id)}
                          >
                            <FiTrash2 size={16} className="text-danger" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* View Details Modal */}
        <Modal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-5">Message Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {selectedMessage && (
              <div>
                <Row className="mb-3 g-3">
                  <Col md={6}>
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                        <FiUser /> Full Name
                      </div>
                      <div className="fw-semibold">{selectedMessage.name}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                        <FiCalendar /> Sent Date
                      </div>
                      <div className="fw-semibold">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                        <FiMail /> Email Address
                      </div>
                      <div className="fw-semibold">{selectedMessage.email}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                        <FiPhone /> Phone Number
                      </div>
                      <div className="fw-semibold">
                        {selectedMessage.phoneNumber}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="p-3 border rounded-3 mt-3">
                  <div className="small text-muted mb-2 fw-semibold">MESSAGE:</div>
                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "#334155",
                      marginBottom: 0,
                    }}
                  >
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <a
              href={`mailto:${selectedMessage?.email}`}
              className="btn btn-primary"
            >
              Reply via Email
            </a>
            <Button
              variant="secondary"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={!!deleteId}
          onHide={() => setDeleteId(null)}
          centered
          size="sm"
        >
          <Modal.Body className="text-center p-4">
            <FiTrash2 size={40} className="text-danger mb-3" />
            <h5>Delete Message?</h5>
            <p className="text-muted small mb-4">
              This action cannot be undone.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Button
                variant="light"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default ContactMessage;