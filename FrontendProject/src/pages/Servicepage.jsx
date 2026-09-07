
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Bike, Car, IdCard, Wallet } from 'lucide-react'

const ServicePage = () => (
  <div className="bg-white py-5">
    <Container>
      <h1 className="text-center" style={{ fontFamily: 'Syne', color: '#211c16' }}>
        Our Services
      </h1>
      <p className="text-center mx-auto mb-5" style={{ fontFamily: 'DM Sans', color: '#211c16', opacity: 0.7, maxWidth: '480px' }}>
        Everything you need to rent a vehicle in Nepal, in one place.
      </p>

      <Row xs={1} sm={2} lg={4} className="g-4">
        <Col>
          <Card className="h-100 border-0 shadow-sm text-center service-card">
            <Card.Body className="p-4">
              <Bike size={36} color="#ff6b4a" className="mb-3" />
              <Card.Title style={{ fontFamily: 'Syne', color: '#211c16', fontSize: '1.1rem' }}>Bike Rental</Card.Title>
              <Card.Text style={{ fontFamily: 'DM Sans', color: '#211c16', opacity: 0.75 }}>
                Scooters & bikes by the hour or day.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 border-0 shadow-sm text-center service-card">
            <Card.Body className="p-4">
              <Car size={36} color="#ff6b4a" className="mb-3" />
              <Card.Title style={{ fontFamily: 'Syne', color: '#211c16', fontSize: '1.1rem' }}>Car Rental</Card.Title>
              <Card.Text style={{ fontFamily: 'DM Sans', color: '#211c16', opacity: 0.75 }}>
                Sedans & SUVs for city or long trips.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 border-0 shadow-sm text-center service-card">
            <Card.Body className="p-4">
              <IdCard size={36} color="#ff6b4a" className="mb-3" />
              <Card.Title style={{ fontFamily: 'Syne', color: '#211c16', fontSize: '1.1rem' }}>Nagarikta Verification</Card.Title>
              <Card.Text style={{ fontFamily: 'DM Sans', color: '#211c16', opacity: 0.75 }}>
                Fast, secure ID verification.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 border-0 shadow-sm text-center service-card">
            <Card.Body className="p-4">
              <Wallet size={36} color="#ff6b4a" className="mb-3" />
              <Card.Title style={{ fontFamily: 'Syne', color: '#211c16', fontSize: '1.1rem' }}>eSewa & Khalti Payments</Card.Title>
              <Card.Text style={{ fontFamily: 'DM Sans', color: '#211c16', opacity: 0.75 }}>
                Pay instantly with local wallets.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .service-card { transition: transform .2s ease, box-shadow .2s ease; }
        .service-card:hover { transform: translateY(-4px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.1) !important; }
      `}</style>
    </Container>
  </div>
)

export default ServicePage