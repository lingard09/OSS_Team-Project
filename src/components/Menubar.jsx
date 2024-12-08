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

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname.startsWith("/movie/")) {
      navigate(-1); // 이전 페이지로 돌아가기
    } else if (searchParams.get("page")) {
      navigate("/?page=1"); // 메인 페이지 1페이지로 이동
    } else {
      navigate("/"); // 그 외의 경우 홈으로 이동
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
              <Nav.Link as={Link} to="/" className="nav-text me-3">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/watch-later" className="nav-text me-3">
                Watch Later List
              </Nav.Link>
              <Nav.Link as={Link} to="/search" className="nav-text">
                Search
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
};

export default Menubar;
