import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { api } from "../services/api";

function OTT() {
  const [ottServices, setOttServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: "",
    customService: "",
    startDate: "",
    price: "",
    cardInfo: "",
  });
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null); // 이전 에러 초기화
      const response = await api.getOttServices();
      console.log("API Response:", response); // 응답 확인
      setOttServices(response.data);
    } catch (err) {
      console.error("Fetch Error:", err); // 상세 에러 로깅
      setError("Failed to load services: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.startDate || !formData.price || !formData.cardInfo) {
      setError("Please fill in all required fields");
      return;
    }

    const serviceToAdd = {
      name: showCustomInput ? formData.customService : formData.serviceName,
      startDate: formData.startDate,
      price: formData.price,
      cardInfo: formData.cardInfo,
    };

    // 서비스 이름 검증
    if (!serviceToAdd.name) {
      setError("Please select or enter a service name");
      return;
    }

    try {
      console.log("Adding service:", serviceToAdd); // 데이터 로깅
      const response = await api.addOttService(serviceToAdd);
      console.log("Response:", response); // 응답 로깅
      await fetchServices();
      setFormData({
        serviceName: "",
        customService: "",
        startDate: "",
        price: "",
        cardInfo: "",
      });
      setShowCustomInput(false);
    } catch (err) {
      console.error("Error details:", err); // 자세한 에러 정보 로깅
      setError("Failed to add service: " + (err.message || "Unknown error"));
    }
  };

  const handleRemove = async (serviceId) => {
    try {
      await api.deleteOttService(serviceId);
      await fetchServices();
    } catch (err) {
      setError("Failed to remove service");
    }
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

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

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
                        <option value="Amazon Prime">Amazon Prime</option>
                        <option value="Apple TV+">Apple TV+</option>
                        <option value="Hulu">Hulu</option>
                        <option value="HBO Max">HBO Max</option>
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
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : ottServices.length === 0 ? (
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
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-3">{service.name}</h5>
                            <p className="mb-2 text-secondary">
                              Started: {service.startDate}
                            </p>
                            <p className="mb-2 text-secondary">
                              Price: ₩{Number(service.price).toLocaleString()}
                              /month
                            </p>
                            <p className="mb-0 text-secondary">
                              Card: **** {service.cardInfo}
                            </p>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemove(service.id)}
                          >
                            Remove
                          </Button>
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
