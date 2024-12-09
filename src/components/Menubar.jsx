import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

const Menubar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === ''; 

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname.startsWith("/movie/")) {
      navigate(-1);
    } else if (searchParams.get("page")) {
      navigate("/?page=1");
    } else {
      navigate("/");
    }
  };

  return (
    <Navbar
      bg="black"
      variant="dark"
      expand="lg"
      fixed="top"
      className="netflix-nav shadow-sm"
    >
      <Container fluid className="px-4 px-md-5">
        <div className="container-inner d-flex justify-content-between w-100">
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center"
            onClick={handleLogoClick}
          >
            <span className="brand-text">Mflix</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link-custom me-3 ${isHome ? 'active' : ''}`}
                style={
                  location.pathname === "/"
                    ? { color: "#E50914 !important" }
                    : {}
                }
              >
                🏠 Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/watch-later"
                className={`nav-link-custom me-3 ${
                  location.pathname === "/watch-later" ? "active" : ""
                }`}
                style={
                  location.pathname === "/watch-later"
                    ? { color: "#E50914 !important" }
                    : {}
                }
              >
                📺 Watch Later List
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/search"
                className={`nav-link-custom me-3 ${
                  location.pathname === "/search" ? "active" : ""
                }`}
                style={
                  location.pathname === "/search"
                    ? { color: "#E50914 !important" }
                    : {}
                }
              >
                {" "}
                🔍 Search
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/ott"
                className={`nav-link-custom ${
                  location.pathname === "/ott" ? "active" : ""
                }`}
                style={
                  location.pathname === "/ott"
                    ? { color: "#E50914 !important" }
                    : {}
                }
              >
                {" "}
                🎟️ OTT
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
};

export default Menubar;
