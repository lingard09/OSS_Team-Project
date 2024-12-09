import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

function OTT() {
  const [ottServices, setOttServices] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: "",
    customService: "",
    startDate: "",
    price: "",
    cardInfo: "",
  });

  useEffect(() => {
    const savedServices = JSON.parse(
      localStorage.getItem("ottServices") || "[]"
    );
    setOttServices(savedServices);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceToAdd = {
      name: showCustomInput ? formData.customService : formData.serviceName,
      startDate: formData.startDate,
      price: formData.price,
      cardInfo: formData.cardInfo,
      id: Date.now(), // 고유 식별자
    };

    if (serviceToAdd.name) {
      const updatedServices = [...ottServices, serviceToAdd];
      setOttServices(updatedServices);
      localStorage.setItem("ottServices", JSON.stringify(updatedServices));
      // 폼 초기화
      setFormData({
        serviceName: "",
        customService: "",
        startDate: "",
        price: "",
        cardInfo: "",
      });
      setShowCustomInput(false);
    }
  };

  const handleRemove = (serviceId) => {
    const updatedServices = ottServices.filter((s) => s.id !== serviceId);
    setOttServices(updatedServices);
    localStorage.setItem("ottServices", JSON.stringify(updatedServices));
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setFormData({
        ...formData,
        serviceName: value,
      });
    }
  };

  return (
    <div className="dark-theme">
      <Container fluid className="py-4 px-4 px-md-5">
        <div className="container-inner">
          <h2 className="text-light mb-4">My OTT Services</h2>

          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Card bg="dark" text="light" className="p-4 border-secondary">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>OTT Service</Form.Label>
                    {!showCustomInput ? (
                      <Form.Select
                        value={formData.serviceName}
                        onChange={handleSelectChange}
                        className="bg-dark text-light border-secondary mb-3"
                      >
                        <option value="">Select an OTT service</option>
                        <option value="Netflix">Netflix</option>
                        <option value="Disney+">Disney+</option>
                        <option value="Amazon Video Prime">Amazon Video Prime</option>
                        <option value="Apple TV+">Apple TV+</option>
                        <option value="Wavve">Wavve</option>
                        <option value="Watcha">Watcha</option>
                        <option value="TVING">TVING</option>
                        <option value="Coupang Play">Coupang Play</option>
                        <option value="custom">Add Custom Service</option>
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type="text"
                        value={formData.customService}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customService: e.target.value,
                          })
                        }
                        placeholder="Enter OTT service name"
                        className="bg-dark text-light border-secondary mb-3"
                      />
                    )}

                    <Form.Label>Subscription Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="bg-dark text-light border-secondary mb-3"
                    />

                    <Form.Label>Monthly Price (₩)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="Enter monthly subscription price"
                      className="bg-dark text-light border-secondary mb-3"
                    />

                    <Form.Label>Card Information</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.cardInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, cardInfo: e.target.value })
                      }
                      placeholder="Enter card information (Last 4 digits)"
                      className="bg-dark text-light border-secondary mb-3"
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="danger">
                      Add Service
                    </Button>
                    {showCustomInput && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowCustomInput(false);
                          setFormData({ ...formData, customService: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8}>
              {ottServices.length === 0 ? (
                <div className="text-center text-secondary">
                  No OTT services added yet
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {ottServices.map((service) => (
                    <Card
                      key={service.id}
                      bg="dark"
                      text="light"
                      className="border-secondary"
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">{service.name}</h5>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemove(service.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="text-secondary">
                          <p className="mb-1">Started: {service.startDate}</p>
                          <p className="mb-1">
                            Monthly Price: ₩
                            {Number(service.price).toLocaleString()}
                          </p>
                          <p className="mb-0">Card: **** {service.cardInfo}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </div>
        <footer className="credits mt-5">
          <div className="footer-content">
            <div className="footer-divider"></div>
            <p className="footer-text">
              Made with <span className="heart">♥</span> by{" "}
              <span className="developer-names">
                CEO Wonjin Kim & Sungju Kim
              </span>
            </p>
          </div>
        </footer>
      </Container>
    </div>
  );
}

export default OTT;
